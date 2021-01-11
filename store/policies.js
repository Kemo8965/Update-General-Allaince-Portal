import {
  SET_LOADING,
  SET_POLICIES,
  SET_SELECTED_POLICY,
  SET_SELECTED_DEBIT_NOTE,
  SET_SELECTED_CERTIFICATE,
} from '@/helpers/mutation-types'
import { http, branchNumber } from '@/helpers/axios-instance'
import { DateTime } from 'luxon'
import currency from 'currency.js'

export const state = () => ({
  all: [],
  selectedPolicy: null,
  selectedDebitNote: null,
  selectedCertificate: null,
  loading: false,
})

export const getters = {
  selectedPolicy(state) {
    return state.selectedPolicy
  },

  selectedDebitNote(state) {
    return state.selectedDebitNote
  },

  selectedCertificate(state) {
    return state.selectedCertificate
  },

  policies(state) {
    return state.all
  },

  unreceiptedPolicies(_, getters) {
    return getters.policies.filter(
      ({ receiptStatus }) => receiptStatus === 'Unreceipted'
    )
  },

  activePolicies(_, getters) {
    return getters.policies.filter(({ status }) => status === 'Active')
  },

  activePolicyRisks(_, getters) {
    const risksArr = []

    getters.activePolicies.forEach(({ risks }) =>
      risks.forEach((risk) => risksArr.push(risk))
    )

    return risksArr
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_POLICIES](state, payload) {
    state.all = payload
  },

  [SET_SELECTED_POLICY](state, payload) {
    state.selectedPolicy = payload
  },

  [SET_SELECTED_DEBIT_NOTE](state, payload) {
    state.selectedDebitNote = payload
  },

  [SET_SELECTED_CERTIFICATE](state, payload) {
    state.selectedCertificate = payload
  },

  updatePolicy(state) {
    state.selectedPolicy.receiptStatus = 'Receipted'
    state.selectedPolicy.paymentPlan = 'Created'
  },
}

export const actions = {
  async load({ commit, rootState }) {
    try {
      commit(SET_LOADING, true)
      const { data } = await http.get(`/policy`)
      const user = rootState.auth.currentUser
      commit(
        SET_POLICIES,
        data.filter(
          ({ intermediaryId, intermediaryType }) =>
            intermediaryId === user.intermediaryId &&
            user.sourceOfBusiness === intermediaryType
        )
      )
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      console.error(error.message)
    }
  },

  async createPolicy({ commit, rootState, dispatch }) {
    try {
      commit(SET_LOADING, true)
      const user = rootState.auth.currentUser

      const quote = rootState.quotations.selectedQuotation

      // const client = rootState.clients.all.find(({ id }) => id === quote.client)

      // let clientName
      // if (client.clientID.startsWith('IND')) {
      //   clientName =
      //     client.middleName.length > 0
      //       ? `${client.firstName} ${client.middleName} ${client.lastName}`
      //       : `${client.firstName} ${client.lastName}`
      // } else {
      //   clientName = client.companyName
      // }

      // Create Policy object
      const policy = {
        ...quote,
        user: user.intermediaryId,
        nameOfInsured: quote.client,
        policyNumber: quote.quoteNumber.replace('Q', 'P'),
        dateOfIssue: DateTime.local().toISO(),
        expiryDate: quote.endDate,
        timeOfIssue: DateTime.local().toISO(),
        status: 'Active',
        receiptStatus: 'Unreceipted',
        risks: quote.risks,
        sumInsured: sumArray(quote.risks, 'sumInsured'),
        netPremium: sumArray(quote.risks, 'netPremium'),
        paymentPlan: 'NotCreated',
        underwritingYear: DateTime.local().toISO(),
        sourceOfBusiness: user.intermediaryType,
        intermediaryName: user.intermediaryName,
        intermediaryId: user.intermediaryId,
        term: 0,
      }

      // Create debit note object
      const debitNote = {
        remarks: 'Policy creation',
        status: 'Pending',
        debitNoteAmount: Number(sumArray(quote.risks, 'netPremium')),
        dateCreated: DateTime.local().toISO(),
        dateUpdated: DateTime.local().toISO(),
      }

      // Create cover note object
      const coverNote = {
        dateCreated: DateTime.local().toISO(),
        dateUpdated: DateTime.local().toISO(),
      }

      // Approve draft quote
      const quoteResponse = await dispatch('quotations/convertToPolicy', null, {
        root: true,
      })
      // console.info('quoteResponse:', quoteResponse)

      if (quoteResponse.status !== 'Approved') {
        throw new Error('Quotation approval failed!')
      }

      // Create policy
      // TODO: Switch to live API
      const { data: policyRes } = await http.post(
        `/policy/${quote.class.id}`,
        policy
      )
      // const policyRes = await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve({ ...policy, id: Date.now() })
      //     reject(new Error('Promise error!'))
      //   }, 1500)
      // })

      // console.info('policyRes:', policyRes)

      // TODO: Enable policy ID
      const policyId = policyRes.id
      const policyRisks = policyRes.risks

      // Post cover notes
      await asyncForEach(policyRisks, async (risk, index) => {
        const certificateNumRes = await fetch(
          `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-certificate-number`
        )

        if (!certificateNumRes.ok) {
          throw new Error(
            `${certificateNumRes.status}: Failed to create certificate number!`
          )
        }

        const { data } = await certificateNumRes.json()

        coverNote.certificateNumber = data.certificate_number
        // TODO: Switch to Id for live
        coverNote.policyId = risk.id
        // coverNote.policyId = Date.now()

        // TODO: Switch to API call
        // const { data: coverNoteRes } =
        await http.post(`documents/cover-note`, coverNote)
        // const coverNoteRes = await new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve({ ...coverNote, id: Date.now() })
        //     reject(new Error('Promise error!'))
        //   }, 1500)
        // })

        // console.info('Cover note response:', coverNoteRes)
      })

      // Post debit notes
      const invoiceNumRes = await fetch(
        `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-invoice-number/${branchNumber}/${quote.class.classCode}`
      )

      if (!invoiceNumRes.ok) {
        throw new Error(
          `${invoiceNumRes.status}: Failed to create certificate number!`
        )
      }

      const { data: invoiceNumberRes } = await invoiceNumRes.json()

      debitNote.debitNoteNumber = invoiceNumberRes.invoice_number

      // TODO: Switch to live API
      const { data: debitNoteRes } = await http.post(
        `documents/debit-note/${policyId}`,
        debitNote
      )
      // const debitNoteRes = await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve({ ...debitNote, id: Date.now() })
      //     reject(new Error('Promise error!'))
      //   }, 1500)
      // })
      // console.info('Debit note response:', debitNoteRes)

      // Create transactions
      const debitNoteNumber = debitNoteRes.id

      let singleTransaction

      let balanceTx = 0

      const transactions = await dispatch(
        'transactions/clientTransactionsById',
        quote.clientCode,
        { root: true }
      )

      if (transactions.length === 0) {
        balanceTx = currency(debitNoteRes.debitNoteAmount).value
      } else {
        singleTransaction = transactions[transactions.length - 1]

        balanceTx = currency(singleTransaction.balance).add(
          debitNoteRes.debitNoteAmount
        ).value
      }

      // Create transaction object
      const transaction = {
        open_cash: 0,
        balance: balanceTx,
        client_id: quote.clientCode,
        cr: 0,
        debit_note_id: debitNoteNumber,
        dr: currency(debitNoteRes.debitNoteAmount).value,
        transaction_amount: currency(debitNoteRes.debitNoteAmount).value,
        transaction_date: DateTime.local().toISO(),
        type: 'Debit',
        reference: invoiceNumberRes.invoice_number,
      }

      // Post transaction
      // const transactionRes =
      await dispatch('transactions/createTransaction', transaction, {
        root: true,
      })

      // console.info('transactionRes:', transactionRes)

      // Post risks to RTSA
      asyncForEach(policy.risks, async (risk) => {
        const params = {
          status: 1,
          registrationMark: risk.vehicle.regNumber.replace(/\s/g, ''),
          dateFrom: risk.riskStartDate,
          dateTo: risk.riskEndDate,
          insurancePolicyNo: policy.policyNumber,
          chassisNumber: risk.vehicle.chassisNumber,
          insuranceCompany: `General Alliance Insurance`,
          insuranceCompanyId: 0,
          quarter: Number(risk.expiryQuarter.split('/')[0]),
        }

        params.insuranceType = Number(risk.insuranceType) === 7001 ? 2 : 1

        // const { data: rtsaRes } =
        await dispatch('rtsa/postData', params, {
          root: true,
        })

        // console.info('rtsaRes:', rtsaRes)
      })

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async updatePolicy({ commit, state }) {
    try {
      commit(SET_LOADING, true)
      commit('updatePolicy')
      await http.put(`/policy/${state.selectedPolicy.id}`, state.selectedPolicy)
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  selectPolicy({ commit }, policy) {
    commit(SET_SELECTED_POLICY, policy)
  },

  selectDebitNote({ commit }, debitNote) {
    commit(SET_SELECTED_DEBIT_NOTE, debitNote)
  },

  selectCertificate({ commit }, certificate) {
    commit(SET_SELECTED_CERTIFICATE, certificate)
  },
}

// Add values in array
function sumArray(items, prop) {
  return items.reduce((sum, item) => currency(sum).add(item[prop]).value, 0)
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
