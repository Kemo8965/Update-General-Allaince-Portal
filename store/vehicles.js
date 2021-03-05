/* eslint-disable prettier/prettier */
import { getField, updateField } from 'vuex-map-fields'
import { api } from '~/helpers/axios-instance'
import { GET_PRODUCT_TYPES, SET_LOADING } from '~/helpers/mutation-types'

export const state = () => ({
  loading: false,
  vehicle: {
    vehicleMake: null,
    vehicleModelName: null,
    yearOfManufacture: null,
    vehicleRegNumber: null,
    vehicleEngineNumber: null,
    vehicleChassisNumber: null,
    vehicleColour: null,
    seatCapacity: null,
    cubicCapacity: null,
    bodyType: null,
    productTypeID: null,
    certificateNumber: null,
    startDate: null,
    endDate: null,
    numOfQuarters: null,
    insuredNames: null,
    premium: null,
  },
  productTypes: [],
  // productTypes: [
  //   { value: 1, label: 'Private' },
  //   { value: 2, label: 'Bus / Taxi' },
  //   { value: 3, label: 'Commercial' },
  // ],
  bodyTypes: [
    'Sedan',
    'Trailer',
    'Truck',
    'Van',
    'SUV',
    'Hatchback',
    'Horse',
    'Motorcycle',
  ],
})

export const getters = {
  getField,

  loading(state) {
    return state.loading
  },

  productTypes(state) {
    return state.productTypes.map((productType) => ({
      label: productType.productTypeName,
      value: productType.id,
    }))
  },

  bodyTypes(state) {
    return state.bodyTypes
      .sort()
      .map((bodyType) => ({ label: bodyType, value: bodyType }))
  },

  vehiclesInActivePolicies(_, __, ___, rootGetters) {
    const policies = rootGetters['policies/activePolicies']
    return policies
      .map((policy) => policy.vehicles.map((vehicle) => vehicle))
      .flat()
  },

  vehicle(state) {
    return state.vehicle
  },
}

export const mutations = {
  updateField,

  [SET_LOADING](state, loading) {
    state.loading = loading
  },

  [GET_PRODUCT_TYPES](state, productTypes) {
    state.productTypes = productTypes
  },
}

export const actions = {
  async getProductTypes({ commit }) {
    try {
      commit(SET_LOADING, true)
      const { data: productTypes } = await api.get(`/tp/productTypes`)
      commit(GET_PRODUCT_TYPES, productTypes.data)
      commit(SET_LOADING, false)
    } catch ({ message }) {
      commit(SET_LOADING, false)
      this.$log.error(message)
    }
  },
}
