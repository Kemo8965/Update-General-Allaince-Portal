// import axios from 'axios'

import { SET_LOADING, SET_USERS, CACHE_USER } from '@/helpers/mutation-types'

export const state = () => ({
  cached: null,
  all: [],
  loading: false,
})

export const getters = {
  cachedUser(state) {
    return state.cached
  },
}

export const mutations = {
  [SET_USERS](state, payload) {
    state.all = payload
  },

  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [CACHE_USER](state, payload) {
    state.cached = payload
  },
}

export const actions = {
  async init({ commit }) {
    try {
      commit(SET_LOADING, true)

      const usersRes = await fetch(`${process.env.NUXT_ENV_AUTH_URL}/user`)

      if (!usersRes.ok)
        throw new Error('Something went wrong when loading users!')

      const users = await usersRes.json()

      users.forEach((user) => delete user.password)

      commit(SET_USERS, users)

      commit(SET_LOADING, false)
    } catch ({ message }) {
      commit(SET_LOADING, false)
      console.error(message)
    }
  },

  cacheUser({ commit, state }, { email }) {
    const matchedUser = state.all.find((user) => user.email === email)
    if (matchedUser) {
      commit(CACHE_USER, matchedUser)
    }
  },

  fetchUsersName({ state }, id) {
    const user = state.all.find((user) => user.ID === id)
    return `${user.first_name} ${user.surname}`
  },
}
