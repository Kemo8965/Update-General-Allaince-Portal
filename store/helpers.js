import { SET_CURRENCY } from '@/helpers/mutation-types'

export const state = () => ({
  currency: null,
  currencies: ['USD', 'ZMW'],
  quarters: ['1', '2', '3', '4'],
  companyDetails: {
    name: 'General Alliance Insurance Zambia',
    address: [
      'General Alliance Insurance Zambia',
      '35370 Thabo Mbeki Road,',
      'Garden Plaza Office Park,',
      'Lusaka, Zambia',
      '+260 211 221714',
      '+260 211 221715',
      '+260 972 369438',
    ],
    vatReg: '[VAT Reg Here]',
    tPin: '[TPIN Here]',
  },
})

export const getters = {
  currencies(state) {
    return state.currencies
      .sort((a, b) => a - b)
      .map((currency) => ({ label: currency, value: currency }))
  },

  quarters(state) {
    return state.quarters
      .sort((a, b) => a - b)
      .map((quarter) => ({ label: quarter, value: quarter }))
  },

  selectedCurrency(state) {
    return state.currency
  },

  name(state) {
    return state.companyDetails.name
  },

  address(state) {
    return state.companyDetails.address
  },

  vatReg(state) {
    return state.companyDetails.vatReg
  },

  tPin(state) {
    return state.companyDetails.tPin
  },
}

export const mutations = {
  [SET_CURRENCY](state, payload) {
    state.currency = payload
  },
}

export const actions = {
  setCurrency({ commit }, currency) {
    commit(SET_CURRENCY, currency)
  },
}
