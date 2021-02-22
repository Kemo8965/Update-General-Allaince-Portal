export const state = () => ({})

export const getters = {}

export const mutations = {}

export const actions = {
  async nuxtServerInit({ dispatch }, __) {
    try {
      await dispatch('external-services/load', null, { root: true })
      await dispatch('vehicles/getProductTypes', null, { root: true })
    } catch (error) {
      this.$log.error(error.message)
    }
  },
}
