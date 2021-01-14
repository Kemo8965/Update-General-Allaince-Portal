/* eslint-disable no-console */
import { SET_AUTH_USER, SET_LOADING } from '@/helpers/mutation-types'

export const state = () => ({
  currentUser: null,
  loading: false,
})

export const getters = {
  loggedIn(state) {
    return !!state.currentUser
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  [SET_AUTH_USER](state, user) {
    state.currentUser = user
  },

  [SET_LOADING](state, value) {
    state.loading = value
  },
}

export const actions = {
  // Logs in the current user.
  async logIn({ commit, dispatch }, { email, password } = {}) {
    try {
      commit(SET_LOADING, true)
      const {
        user: authUser,
      } = await this.$fire.auth.signInWithEmailAndPassword(email, password)

      // dispatch('users/cacheUser', authUser, { root: true })

      this.$cookies.set('token', await authUser.getIdToken(), {
        sameSite: false,
        secure: true,
      })

      await dispatch('onAuthStateChanged', { authUser })

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      console.error(error.message)
      throw error
    }
  },

  // Logs out the current user.
  async logOut({ commit }) {
    try {
      await this.$fire.auth.signOut()
      this.$cookies.remove('token')
      commit(SET_AUTH_USER, null)
    } catch (error) {
      console.error(error.message)
    }
  },

  async onAuthStateChanged({ commit, getters, dispatch }, { authUser }) {
    try {
      const db = this.$fire.firestore.collection('users')

      if (!authUser) {
        // Perform logout operations
        dispatch('logOut')
      } else {
        // Do something with the authUser and the claims object...
        dispatch('users/load', null, { root: true })
        dispatch('users/cacheUser', authUser, { root: true })

        if (getters.loggedIn) {
          return
        }

        this.$cookies.set('token', await authUser.getIdToken(), {
          sameSite: false,
          secure: true,
        })

        const profile = (await db.doc(authUser.uid).get()).data()
        const user = {
          id: authUser.uid,
          email: authUser.email,
          ...profile,
        }

        // Load other stores
        // External services
        await dispatch('external-services/load', null, { root: true })
        // Classes
        await dispatch('classes/load', null, { root: true })

        commit(SET_AUTH_USER, user)
        return user
      }
    } catch (error) {
      console.error(error.message)
    }
  },
}
