import { http } from '@/helpers/axios-instance'
import _ from 'lodash'
import {
  SET_INDIVIDUAL_CLIENTS,
  ADD_INDIVIDUAL_CLIENT,
  SET_CORPORATE_CLIENTS,
  ADD_CORPORATE_CLIENT,
  SET_ALL_CLIENTS,
  SET_LOADING,
  SET_SELECTED_CLIENT,
} from '@/helpers/mutation-types'
const clientType = {
  IND: 'IND',
  CORP: 'CORP',
}

export const state = () => ({
  selectedClient: null,
  all: [],
  individual: [],
  individualOptions: {
    title: ['Mr', 'Mrs', 'Miss', 'Dr', 'Prof', 'Sir'],
    gender: ['Male', 'Female', 'Other'],
    maritalStatus: ['Single', 'Married', 'Widow', 'Widower'],
    idType: ['NRC', 'Passport'],
  },
  corporate: [],
  loading: false,
})

export const getters = {
  loading(state) {
    return state.loading
  },

  allClients(state) {
    return state.all
  },

  individualClients(state) {
    return state.individual
  },

  activeIndividualClients(state) {
    return state.individual.filter((client) => client.status !== 'Inactive')
  },

  individualOptions(state) {
    return state.individualOptions
  },

  corporateClients(state) {
    return state.corporate
  },

  activeCorporateClients(state) {
    return state.corporate.filter((client) => client.status !== 'Inactive')
  },

  selectedClient(state) {
    return state.selectedClient
  },

  selectedClientName(state) {
    return getClientName(state.selectedClient, false)
  },

  selectedTitledClientName(state) {
    return getClientName(state.selectedClient)
  },
}

export const mutations = {
  [SET_INDIVIDUAL_CLIENTS](state, payload) {
    state.individual = payload
  },

  [ADD_INDIVIDUAL_CLIENT](state, payload) {
    state.individual.push(payload)
  },

  [SET_CORPORATE_CLIENTS](state, payload) {
    state.corporate = payload
  },

  [ADD_CORPORATE_CLIENT](state, payload) {
    state.corporate.push(payload)
  },

  [SET_ALL_CLIENTS](state, payload) {
    state.all = payload
  },

  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  [SET_SELECTED_CLIENT](state, payload) {
    state.selectedClient = payload
  },
}

export const actions = {
  async init({ commit }) {
    try {
      commit(SET_LOADING, true)
      const { data: individuals } = await http.get('/clients/individual')
      const { data: corporates } = await http.get('/clients/corporate')
      commit(SET_INDIVIDUAL_CLIENTS, individuals)
      commit(SET_CORPORATE_CLIENTS, corporates)
      commit(SET_ALL_CLIENTS, [...individuals, ...corporates])
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      console.error(error.message)
    }
  },

  async createIndividualClient({ commit }, client) {
    try {
      commit(SET_LOADING, true)
      const response = await fetch(
        `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-client-number/${clientType.IND}`
      )

      if (!response.ok) {
        throw new Error(`${response.status}: Failed to create client number!`)
      }

      const { data: clientNumber } = await response.json(`${process}`)

      client.clientID = clientNumber.client_number
      client.clientType = `Individual`
      client.status = `Inactive`
      client.address = _.startCase(client.address)
      client.accountName = _.startCase(client.accountName)
      client.accountType = _.startCase(client.accountType)
      client.bank = _.startCase(client.bank)
      client.branch = _.startCase(client.branch)
      client.firstName = _.startCase(client.firstName)
      client.middleName = _.startCase(client.middleName)
      client.lastName = _.startCase(client.lastName)
      client.occupation = _.startCase(client.occupation)
      const { data } = await http.post(`/clients/individual`, client)
      commit(ADD_INDIVIDUAL_CLIENT, data)
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  async createCorporateClient({ commit }, client) {
    try {
      commit(SET_LOADING, true)
      const response = await fetch(
        `${process.env.NUXT_ENV_NUMBER_GEN_API_URL}/savenda-client-number/${clientType.CORP}`
      )

      if (!response.ok) {
        throw new Error(`${response.status}: Failed to create client number!`)
      }

      const { data: clientNumber } = await response.json(`${process}`)

      client.clientID = clientNumber.client_number
      client.clientType = `Corporate`
      client.status = `Inactive`
      client.accountName = _.startCase(client.accountName)
      client.accountType = _.startCase(client.accountType)
      client.bank = _.startCase(client.bank)
      client.branch = _.startCase(client.branch)
      client.contactFirstName = _.startCase(client.contactFirstName)
      client.contactLastName = _.startCase(client.contactLastName)
      const { data } = await http.post(`/clients/corporate`, client)
      commit(ADD_CORPORATE_CLIENT, data)
      commit(SET_LOADING, false)
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  selectClient({ commit }, client) {
    commit(SET_SELECTED_CLIENT, client)
  },

  async selectClientById({ dispatch }, clientId) {
    const client = await dispatch('clientById', clientId)
    await dispatch('selectClient', client)
  },

  resetSelectedClient({ commit }) {
    commit(SET_SELECTED_CLIENT, null)
  },

  clientById({ getters }, clientId) {
    return getters.allClients.find(({ id }) => id === clientId)
  },
}

function getClientName(client, useTitle = true) {
  if (client.clientID.includes('IND')) {
    const title = useTitle ? client.title : null
    let fullname
    if (client.middlename) {
      fullname = `${client.firstName} ${client.middleName} ${client.lastName}`
    } else {
      fullname = `${client.firstName} ${client.lastName}`
    }
    return title
      ? _.startCase(`${title} ${fullname.toLowerCase()}`)
      : _.startCase(fullname.toLowerCase())
  }

  return client.companyName
}
