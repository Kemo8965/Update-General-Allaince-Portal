import {
  SET_LOADING,
  SET_POLICIES,
  SET_SELECTED_POLICY,
  ACTIVATE_POLICY,
  GET_ACTIVE_POLICIES,
  GET_INACTIVE_POLICIES,
} from '@/helpers/mutation-types'
// import { DateTime } from 'luxon'
// import currency from 'currency.js'
import { getField, updateField } from 'vuex-map-fields'
import { api } from '~/helpers/axios-instance'

export const state = () => ({
  all: [],
  activePolicies: [],
  inactivePolicies: [],
  selectedPolicy: null,
  loading: false,
  form: {
    clientType: null,
    numOfQuarters: null,
    startDate: null,
    endDate: null,
    currency: null,
    createdBy: null,
    agencyID: null,
    clientID: null,
    productTypeID: null,
    vehicles: [],
  },
})

export const getters = {
  getField,

  selectedPolicy(state) {
    return state.selectedPolicy
  },

  policies(state) {
    return state.all
  },

  inactivePolicies(state) {
    return state.inactivePolicies
  },

  activePolicies(state) {
    return state.activePolicies
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  updateField,

  [SET_LOADING](state, loading) {
    state.loading = loading
  },

  [SET_POLICIES](state, policies) {
    state.all = policies
  },

  [SET_SELECTED_POLICY](state, policy) {
    state.selectedPolicy = policy
  },

  [GET_ACTIVE_POLICIES](state, policies) {
    state.activePolicies = policies
  },

  [GET_INACTIVE_POLICIES](state, policies) {
    state.inactivePolicies = policies
  },

  [ACTIVATE_POLICY](state) {
    state.selectedPolicy.status = 'Active'
    state.selectedPolicy.receiptStatus = 'Receipted'
    state.selectedPolicy.paymentPlan = 'Created'
    const index = state.all.findIndex(
      ({ id }) => id === state.selectedPolicy.id
    )
    state.all.splice(index, 1, state.selectedPolicy)
  },
}

export const actions = {
  async load({ dispatch, commit, getters }) {
    try {
      await dispatch('getActivePolicies')
      await dispatch('getInactivePolicies')

      // commit(SET_POLICIES, [
      //   ...getters.activePolicies,
      //   ...getters.inactivePolicies,
      // ])
    } catch (error) {
      this.$log.error(error.message)
    }
  },

  async getActivePolicies({ commit }) {
    try {
      commit(SET_LOADING, true)
      const { data: activePolicies } = await api.get(`/tp/receiptedPolicies`)

      activePolicies.data
        ? commit(GET_ACTIVE_POLICIES, activePolicies.data)
        : commit(GET_ACTIVE_POLICIES, [])

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      this.$log.error(error.message)
    }
  },

  async getInactivePolicies({ commit }) {
    try {
      commit(SET_LOADING, true)
      const { data: inactivePolicies } = await api.get(
        `/tp/unReceiptedPolicies`
      )

      inactivePolicies.data
        ? commit(GET_INACTIVE_POLICIES, inactivePolicies.data)
        : commit(GET_INACTIVE_POLICIES, [])

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      this.$log.error(error.message)
    }
  },

  createPolicy({ commit }) {
    try {
      commit(SET_LOADING, true)

      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  postPolicyToRtsa({ commit }) {
    try {
      commit(SET_LOADING, true)
      // const policy = state.selectedPolicy

      // // Post risks to RTSA
      // await asyncForEach(policy.risks, async (risk) => {
      //   const params = {
      //     status: 1,
      //     registrationMark: risk.vehicle.regNumber.replace(/\s/g, ''),
      //     dateFrom: risk.riskStartDate,
      //     dateTo: risk.riskEndDate,
      //     insurancePolicyNo: policy.policyNumber,
      //     chassisNumber: risk.vehicle.chassisNumber,
      //     insuranceCompany: `General Alliance Insurance`,
      //     insuranceCompanyId: 0,
      //     quarter: Number(risk.expiryQuarter.split('/')[0]),
      //   }

      //   params.insuranceType = Number(risk.insuranceType) === 7001 ? 2 : 1

      //   // const { data: rtsaRes } =
      //   await dispatch('rtsa/postData', params, {
      //     root: true,
      // })

      // this.$log.info('rtsaRes:', rtsaRes)
      // })
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      this.$log.error(error.message)
      throw error
    }
  },

  async activatePolicy({ commit, state }) {
    try {
      commit(SET_LOADING, true)
      commit(ACTIVATE_POLICY)
      await api.put(`/policy/${state.selectedPolicy.id}`, state.selectedPolicy)
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  selectPolicy({ commit }, policy) {
    commit(SET_SELECTED_POLICY, policy)
  },
}

// Add values in array
// function sumArray(items, prop) {
//   return items.reduce((sum, item) => currency(sum).add(item[prop]).value, 0)
// }

// async function asyncForEach(array, callback) {
//   for (let index = 0; index < array.length; index++) {
//     await callback(array[index], index, array)
//   }
// }
