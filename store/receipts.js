import { http, httpPay, branchNumber } from '@/helpers/axios-instance'
import {
  SET_LOADING,
  SET_RECEIPTS,
  SET_SELECTED_RECEIPT,
  CANCEL_RECEIPT,
  REINSTATE_RECEIPT,
} from '@/helpers/mutation-types'
import startCase from 'lodash/startCase'
import currency from 'currency.js'
import { DateTime } from 'luxon'

export const state = () => ({
  all: [],
  loading: false,
  types: [
    'Premium Payment',
    'Third Party Recovery',
    'Imprest Retirement Receipt',
    'General Receipt',
  ],
  paymentMethods: ['Cash', 'EFT', 'Bank Transfer', 'Cheque'],
  selectedReceipt: null,
})

export const getters = {
  loading(state) {
    return state.loading
  },

  receipts(state, _, __, rootGetters) {
    const policies = rootGetters['policies/policies']
    const debitNotes = []

    policies.forEach((policy) => {
      policy.debitNotes.forEach((note) => debitNotes.push(note))
    })
    return state.all.filter(
      (receipt) =>
        debitNotes.some(
          ({ debitNoteNumber }) => receipt.invoice_number === debitNoteNumber
        ) && receipt.receipt_status === 'Receipted'
    )

    // return state.all
  },

  cancelledReceipts(state, _, __, rootGetters) {
    const policies = rootGetters['policies/policies']
    const debitNotes = []

    policies.forEach((policy) => {
      policy.debitNotes.forEach((note) => debitNotes.push(note))
    })

    return state.all.filter(
      (receipt) =>
        debitNotes.some(
          ({ debitNoteNumber }) => receipt.invoice_number === debitNoteNumber
        ) && receipt.receipt_status === 'Cancelled'
    )
    // return state.all.filter((receipt) => receipt.receipt_status === 'Cancelled')
  },

  receiptTypes(state) {
    return state.types
  },

  paymentMethods(state) {
    return state.paymentMethods
  },

  selectedReceipt(state) {
    return state.selectedReceipt
  },
}

export const mutations = {
  [SET_RECEIPTS](state, payload) {
    state.all = payload
  },

  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_SELECTED_RECEIPT](state, payload) {
    state.selectedReceipt = payload
  },

  [CANCEL_RECEIPT](state, payload) {
    state.selectedReceipt.receipt_status = 'Cancelled'
    state.selectedReceipt.remarks = payload
  },

  [REINSTATE_RECEIPT](state, payload) {
    state.selectedReceipt.receipt_status = 'Receipted'
    state.selectedReceipt.remarks = payload
  },
}

export const actions = {
  async load({ commit }) {
    try {
      commit(SET_LOADING, true)
      const { data: receiptsResponse } = await httpPay.get('/receipt')

      commit(SET_RECEIPTS, receiptsResponse.data)
      commit(SET_LOADING, false)
    } catch ({ message }) {
      commit(SET_LOADING, false)
      console.error(message)
    }
  },

  selectReceipt({ commit }, receipt) {
    commit(SET_SELECTED_RECEIPT, receipt)
  },

  async cancelReceipt({ commit, state }, { reason }) {
    try {
      const receipt = state.selectedReceipt

      commit(SET_LOADING, true)

      commit(CANCEL_RECEIPT, reason)
      await httpPay.put(`/receipt/${receipt.ID}`, receipt)

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async reinstateReceipt({ commit, state }, { reason }) {
    try {
      const receipt = state.selectedReceipt

      commit(SET_LOADING, true)

      commit(REINSTATE_RECEIPT, reason)
      await httpPay.put(`/receipt/${receipt.ID}`, receipt)

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async makePayment({ commit, dispatch, rootState, rootGetters }, formData) {
    try {
      commit(SET_LOADING, true)
      const user = rootState.auth.currentUser
      const policy = rootState.policies.selectedPolicy

      // Get debit note
      const { data: debitNotes } = await http.get(`/documents/debit-notes`)
      const debitNote = debitNotes.find(
        (debitNote) => debitNote.policy.id === policy.id
      )

      // Get allocation policy
      // const { data: allocationsPolicyRes } = await httpPay.get(
      //   `/allocation-policy`
      // )
      // const allocationsPolicy = allocationsPolicyRes.data
      // const allocationPolicy = allocationsPolicy.find(
      //   (allocationPolicy) =>
      //     allocationPolicy.policy_number === policy.policyNumber
      // )

      // Get allocation receipt
      // const { data: allocationReceiptsRes } = await httpPay.get(
      //   `/allocation-receipt`
      // )
      // const allocationReceipts = allocationReceiptsRes.data

      // Get commission payments
      // const { data: commissionPaymentsRes } = await httpPay.get(
      //   `/commission-Processing`
      // )
      // const commissionPayments = commissionPaymentsRes.data
      // let commissionPayment

      const cachedUser = rootGetters['users/cachedUser']

      const receipt = {
        date_received: DateTime.local().toISO(),
        cheq_number: formData.chequeNumber ? formData.chequeNumber : null,
        on_behalf_of: policy.nameOfInsured,
        captured_by: cachedUser.ID,
        receipt_status: 'Receipted',
        sum_in_digits: currency(formData.amount).value,
        today_date: DateTime.local().toISO(),
        invoice_number: debitNote.debitNoteNumber,
        source_of_business: policy.sourceOfBusiness,
        intermediary_name: policy.intermediaryName,
        currency: policy.currency,
      }

      receipt.received_from = startCase(formData.receivedFrom.toLowerCase())
      receipt.payment_method = formData.paymentMethod
      receipt.receipt_type = formData.receiptType
      receipt.narration = formData.narration

      // allocationPolicy.balance = 0
      // allocationPolicy.settlements = currency(policy.netPremium).value
      // allocationPolicy.status = 'Allocated'

      const allocationReceipt = {
        allocated_amount: currency(policy.netPremium).value,
        amount: currency(policy.netPremium).value,
        intermediary_id: policy.intermediaryId,
        intermediary_name: policy.intermediaryName,
        intermediary_type: user.intermediaryType,
        receipt_number: '',
        remaining_amount: 0,
        status: 'Allocated',
      }

      // if (
      //   commissionPayments === undefined ||
      //   commissionPayments === null ||
      //   commissionPayments.length === 0
      // ) {
      //   commissionPayment = {
      //     agent_id: policy.intermediaryId,
      //     agent_name: policy.intermediaryName,
      //     commission_amount: currency(allocationPolicy.commission_due).value,
      //     paid_amount: 0,
      //     remaining_amount: 0,
      //     status: 'Not Paid',
      //     agent_type: 'Agent',
      //   }

      //   await httpPay.post(`/commission-Processing`, commissionPayment)
      // } else {
      //   const comPayments = commissionPayments.filter(
      //     (comPayment) => comPayment.agent_id === policy.intermediaryId
      //   )

      //   if (
      //     comPayments.length === 0 ||
      //     comPayments.length === null ||
      //     comPayments.length === undefined
      //   ) {
      //     commissionPayment = {
      //       agent_id: policy.intermediaryId,
      //       agent_name: policy.intermediaryName,
      //       commission_amount: allocationPolicy.commission_due,
      //       paid_amount: 0,
      //       remaining_amount: 0,
      //       status: 'Not Paid',
      //       agent_type: 'Agent',
      //     }

      //     await httpPay.post(`/commission-Processing`, commissionPayment)
      //   } else if (
      //     comPayments[0].agent_id !== allocationPolicy.intermediary_id
      //   ) {
      //     commissionPayment = {
      //       agent_id: policy.intermediaryId,
      //       agent_name: policy.intermediaryName,
      //       commission_amount: allocationPolicy.commission_due,
      //       paid_amount: 0,
      //       remaining_amount: 0,
      //       status: 'Not Paid',
      //       agent_type: 'Agent',
      //     }

      //     await httpPay.post(`/commission-Processing`, commissionPayment)
      //   } else if (
      //     comPayments[0].agent_id === allocationPolicy.intermediary_id &&
      //     comPayments[0].status === 'Not Paid'
      //   ) {
      //     comPayments[0].commission_amount = currency(
      //       comPayments[0].commission_amount
      //     ).add(allocationPolicy.commission_due).value

      //     await httpPay.put(
      //       `/commission-Processing/${comPayments[0].ID}`,
      //       comPayments[0]
      //     )
      //   } else if (
      //     comPayments[0].agent_id === allocationPolicy.intermediary_id &&
      //     comPayments[0].status !== 'Not Paid'
      //   ) {
      //     commissionPayment = {
      //       agent_id: policy.intermediaryId,
      //       agent_name: policy.intermediaryName,
      //       commission_amount: allocationPolicy.commission_due,
      //       paid_amount: 0,
      //       remaining_amount: 0,
      //       status: 'Not Paid',
      //       agent_type: 'Agent',
      //     }

      //     await httpPay.post(`/commission-Processing`, commissionPayment)
      //   }
      // }

      // Get receipt number
      const response = await fetch(
        `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-receipt-number/${branchNumber}
        }`
      )

      if (!response.ok) {
        throw new Error(`${response.status}: Failed to create receipt number!`)
      }

      const { data } = await response.json()
      receipt.receipt_number = data.receipt_number

      const { data: receiptResponse } = await httpPay.post(`/receipt`, receipt)

      console.info('receiptResponse:', receiptResponse)

      if (!receiptResponse.status) {
        throw new Error('Failed to create receipt!')
      }

      allocationReceipt.receipt_number = receiptResponse.data.receipt_number

      await httpPay.post(`/allocation-receipt`, allocationReceipt)

      // await httpPay.put(
      //   `/allocation-policy/${allocationPolicy.ID}`,
      //   allocationPolicy
      // )

      // await dispatch('policies/updatePolicy', null, { root: true })

      await dispatch('transactions/load', null, { root: true })

      const transactions = await dispatch(
        'transactions/clientTransactionsById',
        policy.clientCode,
        { root: true }
      )
      let transaction, balanceTxn

      if (
        transactions === null ||
        transactions === undefined ||
        transactions === [] ||
        transactions.length === 0
      ) {
        balanceTxn = currency(receiptResponse.data.sum_in_digits).multiply(-1)
          .value
      } else {
        transaction = transactions.slice(-1)[0]

        balanceTxn = currency(transaction.balance)
          .add(receiptResponse.data.sum_in_digits)
          .multiply(-1).value
      }

      const trans = {
        open_cash: 0,
        balance: Number(balanceTxn),
        client_id: policy.clientCode,
        cr: currency(receiptResponse.data.sum_in_digits).multiply(-1).value,
        receipt_id: receiptResponse.data.ID,
        dr: 0,
        transaction_amount: currency(
          receiptResponse.data.sum_in_digits
        ).multiply(-1).value,
        transaction_date: DateTime.local().toISO(),
        type: 'Receipt',
        reference: receiptResponse.data.receipt_number,
      }

      await dispatch('transactions/createTransaction', trans, { root: true })
      await dispatch('transactions/load', null, { root: true })
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)

      throw error
    }
  },
}
