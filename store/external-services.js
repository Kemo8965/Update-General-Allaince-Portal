import {
  SET_COUNTRIES,
  SET_COUNTRY_CALLING_CODES,
  SET_COLORS,
  SET_LOADING,
} from '@/helpers/mutation-types'

export const state = () => ({
  countries: [],
  colors: [],
  countryCallingCodes: [],
  loading: false,
})

export const getters = {
  countries(state) {
    return state.countries
  },

  countryCodes(state) {
    return state.countryCallingCodes
  },

  colors(state) {
    return state.colors
  },

  loading(state) {
    return state.loading
  },
}

export const mutations = {
  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_COUNTRIES](state, payload) {
    state.countries = payload
  },

  [SET_COUNTRY_CALLING_CODES](state, payload) {
    state.countryCallingCodes = payload
  },

  [SET_COLORS](state, payload) {
    state.colors = payload
  },
}

export const actions = {
  async init({ commit }) {
    try {
      commit(SET_LOADING, true)
      const data = await (
        await fetch('https://restcountries.eu/rest/v2/all')
      ).json()

      const countries = ['...']

      data.map((country) => countries.push(country.name))
      const callingCodes = []
      data.forEach((country) =>
        country.callingCodes.forEach((code) => {
          if (code) {
            callingCodes.push({ flag: country.flag, code })
          }
        })
      )

      const colorList = await (
        await fetch(
          'https://raw.githubusercontent.com/hobbiton-technologies/json-colors/master/colors.json'
        )
      ).json()

      commit(
        SET_COLORS,
        colorList.map(({ name }) => name)
      )
      commit(SET_COUNTRIES, countries)
      commit(SET_COUNTRY_CALLING_CODES, callingCodes)
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      console.error(error.message)
    }
  },
}
