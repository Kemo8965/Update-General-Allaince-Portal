// import { http } from '@/helpers/axios-instance'
import { DateTime } from 'luxon'
import currency from 'currency.js'
import { SET_LOADING, SET_SELECTED_RISK } from '@/helpers/mutation-types'
// const branchNumber = 1

export const state = () => ({
  selectedRisk: null,
  selectedBasicPremiumType: null,
  loading: false,
  quarters: [1, 2, 3, 4],
  productType: ['Private', 'Commercial', 'Bus / Taxi'],
  vehicleBodyTypes: [
    'SEDAN',
    'TRAILER',
    'TRUCK',
    'VAN',
    'SUV',
    'HATCHBACK',
    'HORSE',
    'MOTORCYCLE',
  ],
  motorThirdPartyDefaults: {
    basicPremium: 165,
  },
  levyRate: 3,
})

export const getters = {
  selectedRisk(state) {
    return state.selectedRisk
  },

  selectedBasicPremiumType(state) {
    return state.selectedBasicPremiumType
  },

  loading(state) {
    return state.loading
  },

  quarters(state) {
    return state.quarters
  },

  productTypes(state) {
    return state.productType
  },

  levyRate(state) {
    return Number(state.levyRate) / 100
  },

  vehicleBodyTypes(state) {
    return state.vehicleBodyTypes
  },
}

export const mutations = {
  [SET_SELECTED_RISK](state, payload) {
    state.selectedRisk = payload
  },

  [SET_LOADING](state, payload) {
    state.loading = payload
  },

  setBasicPremiumType(state, payload) {
    state.selectedBasicPremiumType = payload
  },

  updateRiskStartDate(state, payload) {
    state.selectedRisk.riskStartDate = payload
    onRiskStartDateChange(payload, state)
  },

  updateRiskEndDate(state, payload) {
    state.selectedRisk.riskEndDate = payload
  },

  updateRiskQuarter(state, payload) {
    state.selectedRisk.riskQuarter = payload
    onRiskQuarterChange(payload, state)
  },

  updateProductType(state, payload) {
    state.selectedRisk.productType = payload
    onProductTypeChange(state)
  },

  updateInsuranceType(state, payload) {
    state.selectedRisk.insuranceType = payload
    calculatePremium(state)
  },

  updateSumInsured(state, payload) {
    state.selectedRisk.sumInsured = payload
    calculatePremium(state)
  },

  updatePremiumRate(state, payload) {
    state.selectedRisk.premiumRate = payload
    calculatePremium(state)
  },

  updateBasicPremium(state, payload) {
    state.selectedRisk.basicPremium = payload
  },

  updateBasicPremiumAmount(state, payload) {
    state.selectedRisk.basicPremiumAmount = payload
    calculatePremium(state)
  },

  pushExtension(state, payload) {
    state.selectedRisk.extensions.push(payload)
    computeTotals(state)
  },

  removeStateExtension(state, payload) {
    state.selectedRisk.extensions.splice(payload, 1)
    computeTotals(state)
  },

  pushDiscount(state, payload) {
    state.selectedRisk.discounts.push(payload)
    computeTotals(state)
  },

  removeStateDiscount(state, payload) {
    state.selectedRisk.discounts.splice(payload, 1)
    computeTotals(state)
  },

  updatePremiumLevy(state, payload) {
    state.selectedRisk.premiumLevy = payload
  },

  updateNetPremium(state, payload) {
    state.selectedRisk.netPremium = payload
  },

  updateNumberOfDays(state, payload) {
    state.selectedRisk.numberOfDays = payload
  },

  updateExpiryQuarter(state, payload) {
    state.selectedRisk.expiryQuarter = payload
  },

  updateLimitsOfLiability(state, payload) {
    state.selectedRisk.limitsOfLiability = payload
    calculatePremium(state)
  },

  updateExcesses(state, payload) {
    state.selectedRisk.excesses = payload
  },

  updateVehicleMake(state, payload) {
    state.selectedRisk.vehicle.vehicleMake = payload
  },

  updateVehicleModel(state, payload) {
    state.selectedRisk.vehicle.vehicleModel = payload
  },

  updateYearOfManufacture(state, payload) {
    state.selectedRisk.vehicle.yearOfManufacture = payload
  },

  updateRegNumber(state, payload) {
    state.selectedRisk.vehicle.regNumber = payload
  },

  updateEngineNumber(state, payload) {
    state.selectedRisk.vehicle.engineNumber = payload
  },

  updateChassisNumber(state, payload) {
    state.selectedRisk.vehicle.chassisNumber = payload
  },

  updateColor(state, payload) {
    state.selectedRisk.vehicle.color = payload
  },

  updateCubicCapacity(state, payload) {
    state.selectedRisk.vehicle.cubicCapacity = payload
  },

  updateSeatingCapacity(state, payload) {
    state.selectedRisk.vehicle.seatingCapacity = payload
  },

  updateBodyType(state, payload) {
    state.selectedRisk.vehicle.bodyType = payload
  },
}

export const actions = {
  async updateRisk({ commit, state }) {
    try {
      commit(SET_LOADING, true)
      // await http.put(`/risk/${state.selectedRisk.id}`, state.selectedRisk)
      // commit(SET_LOADING, false)
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          commit(SET_LOADING, false)
          resolve(
            console.info('Updated risk:', JSON.stringify(state.selectedRisk))
          )
          reject(new Error('A promise error occured!'))
        }, 1500)
      })
    } catch (error) {
      commit(SET_LOADING, false)
      throw error
    }
  },

  selectRisk({ commit }, risk) {
    commit(SET_SELECTED_RISK, risk)
  },
}

function onProductTypeChange(state) {
  if (
    state.selectedRisk.productType &&
    Number(state.selectedRisk.insuranceType) === 7002
  ) {
    thirdPartyPremium()
  }
}

// Handle start date change
function onRiskStartDateChange(date, state) {
  if (state.selectedRisk.riskQuarter) {
    if (state.selectedRisk.discounts.length > 0) {
      resetRiskDiscounts(state)
    }

    const startDate = DateTime.fromISO(date.toISOString())

    return calculateRiskEndDate(
      state.selectedRisk.riskQuarter,
      startDate,
      state
    )
  }
}

// Caluclate expiry quarter and end date
function onRiskQuarterChange(quarter, state) {
  if (!state.selectedRisk.riskStartDate) {
    throw new Error('Please select a start date')
  }

  if (state.selectedRisk.discounts.length > 0) {
    resetRiskDiscounts(state)
  }

  const startDate = DateTime.fromISO(state.selectedRisk.riskStartDate)

  calculateRiskEndDate(quarter, startDate, state)
}

// Caluclate end date
function calculateRiskEndDate(quarter, startDate, state) {
  const endOfStartDateQuarter = startDate.endOf('quarter')
  const endDate =
    quarter > 1
      ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
      : endOfStartDateQuarter

  calculateNumberOfDays(startDate, endDate, state)

  calculatePremium(state)

  state.selectedRisk.expiryQuarter = `${endDate.quarter}/${endDate.year}`
  state.selectedRisk.riskStartDate = startDate.toISO()
  state.selectedRisk.riskEndDate = endDate.toISO()
}

// Add values in array
function sumArray(items) {
  return items.reduce((sum, { amount }) => currency(sum).add(amount).value, 0)
}

// Calculate number of days
function calculateNumberOfDays(startDate, endDate, state) {
  const { days } = endDate.diff(startDate, 'days').toObject()
  state.selectedRisk.numberOfDays = Math.round(days)
}
// Trigger premium calculation
function calculatePremium(state) {
  if (Number(state.selectedRisk.insuranceType) === 7002) {
    thirdPartyPremium(state)
  } else if (
    state.selectedRisk.basicPremiumAmount ||
    state.selectedRisk.premiumRate
  ) {
    comprehensivePremium(state)
  }
}

// Calculate premium for third party insurance
function thirdPartyPremium(state) {
  if (state.selectedRisk.productType.includes('Private')) {
    if (Number(state.selectedRisk.riskQuarter) === 1) {
      state.selectedRisk.basicPremium = 165
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 2) {
      state.selectedRisk.basicPremium = 280
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 3) {
      state.selectedRisk.basicPremium = 370
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 4) {
      state.selectedRisk.basicPremium = 464
      computeTotals(state)
    }
  }

  if (state.selectedRisk.productType.includes('Commercial')) {
    if (Number(state.selectedRisk.riskQuarter) === 1) {
      state.selectedRisk.basicPremium = 199
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 2) {
      state.selectedRisk.basicPremium = 340
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 3) {
      state.selectedRisk.basicPremium = 452
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 4) {
      state.selectedRisk.basicPremium = 566
      computeTotals(state)
    }
  }

  if (state.selectedRisk.productType.includes('Taxi')) {
    if (Number(state.selectedRisk.riskQuarter) === 1) {
      state.selectedRisk.basicPremium = 270
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 2) {
      state.selectedRisk.basicPremium = 464
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 3) {
      state.selectedRisk.basicPremium = 618
      computeTotals(state)
    }
    if (Number(state.selectedRisk.riskQuarter) === 4) {
      state.selectedRisk.basicPremium = 772
      computeTotals(state)
    }
  }
}

// Calculate premium for comprehensive premium
function comprehensivePremium(state) {
  const numOfDays = Number(state.selectedRisk.numberOfDays) / 365
  const premiumRate = Number(state.selectedRisk.premiumRate) / 100

  state.selectedRisk.basicPremium =
    Number(numOfDays) *
    Number(premiumRate) *
    Number(state.selectedRisk.sumInsured)

  computeTotals(state)
}

// Calculate net premium including discounts and others
function computeTotals(state) {
  if (!state.selectedRisk.sumInsured)
    throw new Error('Please enter the sum  insured!')

  let netPremium, basicPremium, premiumWithoutLevy

  const levyRate = Number(state.levyRate) / 100

  const limitsTotalPremium = state.selectedRisk.limitsOfLiability.reduce(
    (sum, { premium }) => Number(sum) + Number(premium),
    0
  )

  const extensionsSum =
    state.selectedRisk.extensions.length > 0
      ? sumArray(state.selectedRisk.extensions)
      : 0
  const discountsSum =
    state.selectedRisk.discounts.length > 0
      ? sumArray(state.selectedRisk.discounts)
      : 0

  if (Number(state.selectedRisk.insuranceType) === 7001) {
    if (
      state.selectedBasicPremiumType &&
      state.selectedBasicPremiumType.includes('Amount')
    ) {
      netPremium = state.selectedRisk.basicPremiumAmount
      const divisor = currency(1).add(levyRate).value
      basicPremium = currency(netPremium).divide(divisor).value
      state.selectedRisk.basicPremium = basicPremium

      premiumWithoutLevy = currency(basicPremium)
        .add(extensionsSum)
        .subtract(discountsSum)
        .add(limitsTotalPremium).value
    } else {
      premiumWithoutLevy = currency(state.selectedRisk.basicPremium)
        .add(extensionsSum)
        .subtract(discountsSum)
        .add(limitsTotalPremium).value
    }
  } else {
    premiumWithoutLevy = currency(state.selectedRisk.basicPremium)
      .add(extensionsSum)
      .subtract(discountsSum)
      .add(limitsTotalPremium).value
  }

  const levyAmount = currency(premiumWithoutLevy).multiply(levyRate).value

  netPremium = currency(premiumWithoutLevy).add(levyAmount).value

  state.selectedRisk.extensionsTotal = extensionsSum
  state.selectedRisk.discountsTotal = discountsSum
  state.selectedRisk.premiumLevy = levyAmount
  state.selectedRisk.netPremium = netPremium
}

// Reset discount
function resetRiskDiscounts(state) {
  state.selectedRisk.discounts = []
  state.selectedRisk.discountsTotal = 0
}
