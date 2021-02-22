import { httpPay } from '@/helpers/axios-instance'
import { SET_TRANSACTIONS } from '@/helpers/mutation-types'
export const state = () => ({
  all: [],
})

export const mutations = {
  [SET_TRANSACTIONS](state, payload) {
    state.all = payload
  },
}
export const actions = {
  async load({ commit }) {
    try {
      const { data } = await httpPay.get(`/transaction`)
      commit(SET_TRANSACTIONS, data.data)
    } catch ({ message }) {
      this.$log.error(message)
    }
  },

  clientTransactionsById({ state }, id) {
    try {
      const transactions = state.all.filter((tx) => tx.client_id === id)
      if (
        transactions === null ||
        transactions === undefined ||
        transactions === [] ||
        transactions.length === 0
      )
        return []

      return transactions
    } catch ({ message }) {
      this.$log.error(message)
    }
  },

  async createTransaction(_, transaction) {
    try {
      // TODO: Switch to live API
      const { data } = await httpPay.post(`/transaction`, transaction)
      return data
      // return await new Promise((resolve, reject) => {
      //   setTimeout(() => {
      //     resolve({ ...transaction, id: Date.now() })
      //     reject(new Error('Promise error!'))
      //   }, 1500)
      // })
    } catch ({ message }) {
      this.$log.error(message)
    }
  },
}
