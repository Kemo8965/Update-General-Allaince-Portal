import { SET_CURRENCY } from '@/helpers/mutation-types'

export const state = () => ({
  currency: null,
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
