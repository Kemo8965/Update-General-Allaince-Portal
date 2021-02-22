// import { httpRtsa } from '@/helpers/axios-instance'

export const actions = {
  async postData(_, params) {
    try {
      // TODO: Switch to live API
      // const { data } = await httpRtsa.post(`/rtsa-golden-lotus`, params)
      // return data
      return await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ ...params, id: Date.now() })
          reject(new Error('Promise error!'))
        }, 3000)
      })
    } catch (error) {
      this.$log.error(error.message)
      throw error
    }
  },
}
