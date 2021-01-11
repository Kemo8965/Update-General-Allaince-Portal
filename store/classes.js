import { http } from '@/helpers/axios-instance'
import { SET_LOADING, SET_CLASSES } from '@/helpers/mutation-types'

export const state = () => ({
  loading: false,
  all: [],
})

export const getters = {
  classes(state) {
    return state.all
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_CLASSES](state, payload) {
    state.all = payload
  },
}

export const actions = {
  async init({ commit, dispatch }) {
    try {
      commit(SET_LOADING, true)
      const { data } = await http.get(`/class`)
      const [{ classId }] = data
      const { data: products } = await http.get(
        `/product/class-products/${classId}`
      )
      dispatch('products/setProducts', products, { root: true })
      commit(SET_CLASSES, data)
      commit(SET_LOADING, false)
    } catch ({ message }) {
      console.error(message)
      commit(SET_LOADING, false)
    }
  },

  getClassByProductCode({ getters }, code) {
    return getters.classes.find(
      (singleClass) =>
        singleClass.products.findIndex(
          ({ productCode }) => productCode === code
        ) !== -1
    )
  },
}
