export const state = () => ({
  default: {
    deathAndInjuryPerPersonMin: 30100,
    deathAndInjuryPerEventMin: 60100,
    propertyDamageMin: 35000,
    deathAndInjuryPerPersonRate: 0,
    deathAndInjuryPerEventRate: 0,
    propertyDamageRate: 0,
    combinedLimitsRate: 0,
  },
  types: ['Standard', 'Third Party Liability Combined'],
})

export const getters = {
  liabilityTypes(state) {
    return state.types
  },

  defaultDeathAndInjuryPerPersonMin(state) {
    return state.default.deathAndInjuryPerPersonMin
  },

  defaultDeathAndInjuryPerEventMin(state) {
    return state.default.deathAndInjuryPerEventMin
  },

  defaultPropertyDamageMin(state) {
    return state.default.propertyDamageMin
  },

  defaultCombinedLimitsMin(state) {
    return (
      state.default.deathAndInjuryPerPersonMin +
      state.default.deathAndInjuryPerEventMin
    )
  },
}
