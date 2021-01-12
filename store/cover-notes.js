import { http } from '@/helpers/axios-instance'
import { SET_COVER_NOTES } from '@/helpers/mutation-types'
export const state = () => ({
  all: [],
})

export const getters = {
  coverNotes(state) {
    return state.all
  },
}

export const mutations = {
  [SET_COVER_NOTES](state, payload) {
    state.all = payload
  },
}

export const actions = {
  async load({ commit }) {
    try {
      const { data } = await http.get(`documents/cover-notes`)
      commit(SET_COVER_NOTES, data)
    } catch ({ message }) {
      console.error(message)
    }
  },
}
