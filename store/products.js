// import { http } from '@/helpers/axios-instance'
import { SET_LOADING, SET_PRODUCTS } from '@/helpers/mutation-types'

export const state = () => ({
  loading: false,
  all: [],
  noExtensions: [{ value: null, text: 'No extensions...' }],
})

export const getters = {
  products(state) {
    return state.all.map(({ productName, productCode }) => ({
      value: productCode,
      text: productName,
    }))
  },

  motorComprehensive(state) {
    return state.all.find(({ productCode }) => productCode === 7001)
  },

  motorComprehensiveExtensions(state, getters) {
    const product = getters.motorComprehensive
    let extensions = []
    product.extensions
      ? product.extensions.map((extension) =>
          extensions.push({
            value: extension,
            text: extension.extensionType,
          })
        )
      : (extensions = state.noExtensions)

    return extensions
  },

  motorThirdParty(state) {
    return state.all.find(({ productCode }) => productCode === 7002)
  },

  motorThirdPartyExtensions(state, getters) {
    const product = getters.motorThirdParty
    let extensions = []
    product.extensions
      ? product.extensions.map((extension) =>
          extensions.push({
            value: extension,
            text: extension.extensionType,
          })
        )
      : (extensions = state.noExtensions)

    return extensions
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_PRODUCTS](state, payload) {
    state.all = payload
  },
}

export const actions = {
  setProducts({ commit }, products) {
    try {
      commit(SET_LOADING, true)
      commit(SET_PRODUCTS, products)
      commit(SET_LOADING, false)
    } catch ({ message }) {
      commit(SET_LOADING, false)
      console.error(message)
    }
  },
}
