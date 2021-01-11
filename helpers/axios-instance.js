import axios from 'axios'

/**
 *  https://number-generation.flosure-api.com/...
 /savenda-quote-number/{branch}/{insuranceType}
 /savenda-receipt-number/{branch}
 /savenda-invoice-number/{branch}/{insuranceType}
 /savenda-client-number/{clientType}
 /savenda-certificate-number
 insuranceType: insurance type productCode
 branch: 1
 */
export const http = axios.create({
  baseURL: process.env.NUXT_ENV_API_URL,
})

export const httpAuth = axios.create({
  baseURL: process.env.NUXT_ENV_AUTH_URL,
})

export const httpPay = axios.create({
  baseURL: process.env.NUXT_ENV_API_PAY_URL,
})

export const httpRtsa = axios.create({
  baseURL: process.env.NUXT_ENV_RTSA_URL,
})

export const numbergen = axios.create({
  baseURL: process.env.NUXT_ENV_NUMBER_GEN_API_URL,
})

export const branchNumber = 1
