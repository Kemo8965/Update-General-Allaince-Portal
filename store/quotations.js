import { http, branchNumber } from '@/helpers/axios-instance'
import { DateTime } from 'luxon'
import {
  SET_LOADING,
  SET_CURRENCY,
  SET_QUOTATIONS,
  APPROVE_QUOTATION,
  SET_SELECTED_QUOTATION,
  SET_HIGHEST_QUARTER,
} from '@/helpers/mutation-types'

export const state = () => ({
  all: [],
  selectedQuotation: null,
  loading: false,
  quarters: [1, 2, 3, 4],
  highestQuarter: null,
  currencies: ['USD', 'ZMW'],
  currency: null,
  quoteStatus: ['Draft', 'Approved'],
  receiptStatus: ['Unreceipted', 'Receipted'],
})

export const getters = {
  quotations(state) {
    return state.all
  },

  selectedQuotation(state) {
    return state.selectedQuotation
  },

  loading(state) {
    return state.loading
  },

  quarters(state) {
    return state.quarters
  },

  highestQuarter(state) {
    return state.highestQuarter
  },

  currencies(state) {
    return state.currencies
  },

  selectedCurrency(state) {
    return state.currency
  },
}

export const mutations = {
  [SET_QUOTATIONS](state, payload) {
    state.all = payload
  },

  [APPROVE_QUOTATION](state) {
    state.selectedQuotation.status = 'Approved'
    const index = state.all.findIndex(
      ({ id }) => id === state.selectedQuotation.id
    )
    state.all.splice(index, 1, state.selectedQuotation)
  },

  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_CURRENCY](state, payload) {
    state.currency = payload
  },

  [SET_SELECTED_QUOTATION](state, payload) {
    state.selectedQuotation = payload
  },

  [SET_HIGHEST_QUARTER](state, payload) {
    state.highestQuarter = payload
  },

  updateClientCode(state, payload) {
    state.selectedQuotation.clientCode = payload
  },

  updateStartDate(state, payload) {
    state.selectedQuotation.startDate = payload
    const { endDate, startDate } = onStartDateChange(payload, state)
    state.selectedQuotation.endDate = endDate
    state.selectedQuotation.startDate = startDate
  },

  updateEndDate(state, payload) {
    state.selectedQuotation.endDate = payload
  },

  updateCurrency(state, payload) {
    state.selectedQuotation.currency = payload
  },

  updateQuarter(state, payload) {
    state.selectedQuotation.quarter = payload
    const { endDate, startDate } = onQuarterChange(payload, state)
    state.selectedQuotation.endDate = endDate
    state.selectedQuotation.startDate = startDate
  },
}

export const actions = {
  async load({ commit, rootState }) {
    try {
      commit(SET_LOADING, true)
      const { data } = await http.get(`/quotation`)
      const user = rootState.auth.currentUser
      commit(
        SET_QUOTATIONS,
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

  async submit({ commit, rootState, rootGetters, dispatch }, quotation) {
    try {
      commit(SET_LOADING, true)
      quotation.risks.forEach((risk) => {
        if (risk.riskQuarter > quotation.quarter)
          throw new Error(
            'One of the attached risks has a validity period beyond that of the policy cover!'
          )
      })

      const response = await fetch(
        `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-quote-number/${branchNumber}/${quotation.risks[0].insuranceType}`
      )

      if (!response.ok) {
        throw new Error(
          `${response.status}: Failed to create quotation number!`
        )
      }

      const { data } = await response.json()
      const user = rootState.auth.currentUser

      await dispatch('clients/selectClientById', quotation.clientCode, {
        root: true,
      })

      // quotation.user = user.userId
      quotation.client = rootGetters['clients/selectedClientName']
      quotation.status = 'Draft'
      quotation.receiptStatus = 'Unreceipted'
      quotation.sourceOfBusiness = user.intermediaryType
      quotation.intermediaryId = user.intermediaryId
      quotation.intermediaryName = user.companyName
      quotation.dateCreated = DateTime.local().toISO()
      quotation.underwritingYear = DateTime.local().toISO()
      quotation.quoteNumber = data.quotation_number
      quotation.class = await dispatch(
        'classes/getClassByProductCode',
        quotation.risks[0].insuranceType,
        { root: true }
      )

      await http.post(`/quotation/${quotation.class.id}`, quotation)

      // Load quotations after posting
      await dispatch('load')

      // Get necessary quotation
      const submittedQuote = await dispatch(
        'quotationByQuoteNumber',
        quotation.quoteNumber
      )

      const quoteWithVehicle = await asyncForEach(
        submittedQuote.risks,
        async (risk, index, arr) => {
          const { status } = await http.post(
            `/vehicle-details/${risk.id}`,
            quotation.risks[index].vehicle
          )

          if (status === 201 && index === arr.length - 1) {
            // Load quotations after posting vehicle details
            await dispatch('load')

            // reload quotation with vehicle attached
            const loopQuoteWithVehicle = await dispatch(
              'quotationByQuoteNumber',
              quotation.quoteNumber
            )

            return loopQuoteWithVehicle
          }
        }
      )

      commit(SET_LOADING, false)

      return quoteWithVehicle
      // console.info('Quotation submitted:', JSON.stringify(quotation))
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async updateQuotation({ commit, state }) {
    try {
      commit(SET_LOADING, true)
      await http.put(
        `/quotation/${state.selectedQuotation.id}`,
        state.selectedQuotation
      )
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async convertToPolicy({ commit, state }) {
    try {
      commit(SET_LOADING, true)
      commit(APPROVE_QUOTATION)

      const { data } = await http.put(
        `/quotation/${state.selectedQuotation.id}`,
        state.selectedQuotation
      )
      commit(SET_LOADING, false)
      return data
      // return await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     // resolve(console.info(JSON.stringify(state.selectedQuotation)))
      //     commit(SET_LOADING, false)
      //     resolve(state.selectedQuotation)
      //     reject(new Error('Promise error!'))
      //   }, 1500)
      // })
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  setCurrency({ commit }, currency) {
    commit(SET_CURRENCY, currency)
  },

  setHighestQuarter({ commit }, quarter) {
    commit(SET_HIGHEST_QUARTER, quarter)
  },

  selectQuotation({ commit }, quotation) {
    commit(SET_SELECTED_QUOTATION, quotation)
  },

  quotationByQuoteNumber({ state }, quoteNumber) {
    return state.all.find((quote) => quote.quoteNumber === quoteNumber)
  },

  resetSelectedQuotation({ commit }) {
    commit(SET_SELECTED_QUOTATION, null)
  },
}

// Caluclate end date
function calculateEndDate(
  quarter = state.selectedQuotation.quarter,
  startDate = DateTime.fromISO(state.selectedQuotation.startDate)
) {
  const endOfStartDateQuarter = startDate.endOf('quarter')
  const endDate =
    quarter > 1
      ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
      : endOfStartDateQuarter

  return { startDate: startDate.toISO(), endDate: endDate.toISO() }
}

function onQuarterChange(quarter, state) {
  try {
    if (!state.selectedQuotation.startDate) {
      throw new Error('Please select a start date')
    }
    const startDate = DateTime.fromISO(state.selectedQuotation.startDate)

    return calculateEndDate(quarter, startDate)
  } catch (error) {
    console.error(error.message)
  }
}

// Handle start date change
function onStartDateChange(date, state) {
  try {
    if (state.selectedQuotation.quarter) {
      const startDate = DateTime.fromISO(date.toISOString())

      return calculateEndDate(state.selectedQuotation.quarter, startDate)
    }
  } catch (error) {
    console.error(error.message)
  }
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}
