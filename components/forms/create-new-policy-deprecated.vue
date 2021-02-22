<template>
  <form id="new-quotation" @submit.prevent="onSubmit">
    <!-- Policy Details -->
    <div class="card">
      <div class="card-header">
        <h4 class="card-header-title is-4">Policy Details</h4>
        <span class="card-header-icon">
          <b-icon icon="note-text-outline"></b-icon>
        </span>
      </div>
    </div>
    <div class="mt-4 box">
      <b-field group-multiline grouped>
        <!-- Client -->
        <b-field :type="clientState" expanded>
          <template v-slot:label>
            Client <span class="has-text-danger">*</span>
          </template>
          <b-autocomplete
            v-model="clientName"
            :data="filteredClients"
            clearable
            field="text"
            icon="account"
            open-on-focus
            placeholder="e.g. John"
            @select="clientSelected"
          >
            <!-- <template v-slot:header>
                <a @click="showAddColor">
                  <span>Add color...</span>
                </a>
              </template> -->
            <template v-slot:empty> No results for {{ clientName }} </template>
          </b-autocomplete>
        </b-field>

        <!-- Start date -->
        <b-field :type="startDateState" expanded>
          <template v-slot:label>
            Start Date <span class="has-text-danger">*</span>
          </template>
          <b-datepicker
            v-model="$v.quotation.startDate.$model"
            :disabled="!$v.quotation.clientCode.$dirty"
            :min-date="minDate"
            icon="calendar-blank-outline"
            mobile-native
            placeholder="-- Please select start date --"
            @input="onStartDateChange"
          ></b-datepicker>
        </b-field>

        <!-- End date -->
        <b-field expanded>
          <template v-slot:label> End Date</template>
          <b-datepicker
            v-model="$v.quotation.endDate.$model"
            :disabled="true"
            icon="calendar-check"
          ></b-datepicker>
        </b-field>
      </b-field>

      <b-field class="mb-4" group-multiline grouped>
        <!-- Currency -->
        <b-field :type="currencyState" class="mt-4" expanded>
          <template v-slot:label>
            Currency <span class="has-text-danger">*</span>
          </template>
          <b-select
            v-model="$v.quotation.currency.$model"
            :disabled="!$v.quotation.startDate.$dirty"
            expanded
            icon="cash"
            placeholder="-- Please select a currency --"
          >
            <option
              v-for="(currency, index) in currencies"
              :key="index"
              :value="currency"
            >
              {{ currency }}
            </option>
          </b-select>
        </b-field>

        <!-- Quarters -->
        <b-field :type="quarterState" class="mt-4" expanded>
          <template v-slot:label>
            Quarters <span class="has-text-danger">*</span>
          </template>
          <b-select
            v-model="$v.quotation.quarter.$model"
            :disabled="!$v.quotation.currency.$dirty"
            expanded
            placeholder="-- Please select a quarter --"
            @input="onQuarterChange"
          >
            <option
              v-for="(quarter, index) in quarters"
              :key="index"
              :value="quarter"
            >
              {{ quarter }}
            </option>
          </b-select>
        </b-field>
      </b-field>
    </div>

    <!-- Risk Details -->
    <div v-if="quotation.quarter" class="card">
      <div class="card-header">
        <h4 class="card-header-title is-4">Vehicle Details</h4>
        <span class="card-header-icon">
          <b-icon icon="car"></b-icon>
        </span>
      </div>
    </div>
    <div v-if="quotation.quarter" class="mt-4 box">
      <b-button
        v-if="!addRisk && quotation.quarter"
        icon-left="plus"
        type="is-primary"
        @click="addRisk = !addRisk"
        >Add Vehicle
      </b-button>

      <div v-if="addRisk">
        <h4 class="title is-4">Particulars of Vehicle</h4>
        <b-field group-multiline grouped>
          <!-- Vehicle Make -->
          <b-field :type="vehMakeState" expanded>
            <template v-slot:label>
              Vehicle Make <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="$v.risk.vehicle.vehicleMake.$model"
              placeholder="Toyota"
            ></b-input>
          </b-field>

          <!-- Vehicle Model -->
          <b-field :type="vehModelState" expanded>
            <template v-slot:label>
              Vehicle Model <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="$v.risk.vehicle.vehicleModel.$model"
              :disabled="!$v.risk.vehicle.vehicleMake.$dirty"
              placeholder="Corolla"
            ></b-input>
          </b-field>

          <!-- Year of Make -->
          <b-field :type="yearOfManState" expanded>
            <template v-slot:label>
              Year of Make <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="$v.risk.vehicle.yearOfManufacture.$model"
              v-mask="'####'"
              :disabled="!$v.risk.vehicle.vehicleModel.$dirty"
              placeholder="2005"
            ></b-numberinput>
          </b-field>
        </b-field>
        <b-field group-multiline grouped>
          <!-- Registration Number -->
          <b-field :type="regNumberState" class="mt-4" expanded>
            <template v-slot:label>
              Registration Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="$v.risk.vehicle.regNumber.$model"
              :disabled="!$v.risk.vehicle.yearOfManufacture.$dirty"
              placeholder="ABC123ZM"
            ></b-input>
          </b-field>

          <!-- Engine Number -->
          <b-field :type="engNumState" class="mt-4" expanded>
            <template v-slot:label>
              Engine Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="$v.risk.vehicle.engineNumber.$model"
              :disabled="!$v.risk.vehicle.regNumber.$dirty"
              placeholder="Engine number"
            ></b-input>
          </b-field>

          <!-- Chassis Number -->
          <b-field :type="chassisNumState" class="mt-4" expanded>
            <template v-slot:label>
              Chassis Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="$v.risk.vehicle.chassisNumber.$model"
              :disabled="!$v.risk.vehicle.engineNumber.$dirty"
              placeholder="Chassis Number"
            ></b-input>
          </b-field>
        </b-field>

        <b-field group-multiline grouped>
          <!-- Color -->
          <b-field :type="colorState" class="mt-4" expanded>
            <template v-slot:label>
              Color <span class="has-text-danger">*</span>
            </template>
            <b-autocomplete
              ref="colorComplete"
              v-model="color"
              clearable
              icon="palette"
              open-on-focus
              placeholder="Pearl"
              :data="filteredColors"
              :disabled="!$v.risk.vehicle.chassisNumber.$dirty"
              @select="colorSelected"
            >
              <template v-slot:header>
                <a @click="showAddColor">
                  <span>Add color...</span>
                </a>
              </template>
              <template v-slot:empty> No results for {{ color }}</template>
            </b-autocomplete>
          </b-field>

          <!-- Cubic Capacity -->
          <b-field :type="ccState" class="mt-4" expanded>
            <template v-slot:label>
              Cubic Capacity <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="$v.risk.vehicle.cubicCapacity.$model"
              v-mask="'####'"
              :disabled="!$v.risk.vehicle.color.$dirty"
              placeholder="1834"
            ></b-numberinput>
          </b-field>

          <!-- Seating Capacity -->
          <b-field :type="seatCapState" class="mt-4" expanded>
            <template v-slot:label>
              Seating Capacity <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="$v.risk.vehicle.seatingCapacity.$model"
              v-mask="'##'"
              :disabled="!$v.risk.vehicle.cubicCapacity.$dirty"
              placeholder="5"
            ></b-numberinput>
          </b-field>
        </b-field>

        <b-field class="mb-4" group-multiline grouped>
          <!-- Body Type -->
          <b-field :type="bodyState" class="mt-4" expanded>
            <template v-slot:label>
              Body Type <span class="has-text-danger">*</span>
            </template>
            <b-select
              v-model="$v.risk.vehicle.bodyType.$model"
              :disabled="!$v.risk.vehicle.seatingCapacity.$dirty"
              placeholder="-- Please select a body type --"
            >
              <option
                v-for="(body, index) in vehicleBodyTypes"
                :key="index"
                :value="body"
              >
                {{ body }}
              </option>
            </b-select>
          </b-field>
        </b-field>

        <div class="py-1"></div>
        <h4 class="mt-4 title is-4">Computations</h4>

        <b-field group-multiline grouped>
          <FormulateInput
            label="Certificate Number"
            name="certificateNumber"
            type="text"
            validation="number|required"
          >
          </FormulateInput>

          <!-- Product Type -->
          <b-field :type="productTypeState" expanded>
            <template v-slot:label>
              Class of Vehicle <span class="has-text-danger">*</span>
            </template>
            <b-select
              v-model="$v.risk.productType.$model"
              expanded
              placeholder="-- Please select a vehicle class --"
              @input="onProductTypeChange"
            >
              <option
                v-for="(productType, index) in productTypes"
                :key="index"
                :value="productType"
              >
                {{ productType }}
              </option>
            </b-select>
          </b-field>
        </b-field>

        <b-field group-multiline grouped>
          <!-- Risk Start date -->
          <b-field :type="riskStartDateState" class="mt-4" expanded>
            <template v-slot:label>
              Risk Start Date <span class="has-text-danger">*</span>
            </template>
            <b-datepicker
              v-model="$v.risk.riskStartDate.$model"
              :disabled="!$v.risk.productType.$dirty"
              :min-date="minDate"
              icon="calendar-blank-outline"
              mobile-native
              placeholder="-- Please select start date --"
              @input="onRiskStartDateChange"
            ></b-datepicker>
          </b-field>

          <!-- Risk Quarters -->
          <b-field :type="riskQuarterState" class="mt-4" expanded>
            <template v-slot:label>
              Risk Quarters <span class="has-text-danger">*</span>
            </template>
            <b-select
              v-model="$v.risk.riskQuarter.$model"
              :disabled="!$v.risk.riskStartDate.$dirty"
              expanded
              placeholder="-- Please select a quarter --"
              @input="onRiskQuarterChange"
            >
              <option
                v-for="(quarter, index) in quarters"
                :key="index"
                :value="quarter"
              >
                {{ quarter }}
              </option>
            </b-select>
          </b-field>

          <!-- Risk End date -->
          <b-field class="mt-4" expanded>
            <template v-slot:label> Risk End Date</template>
            <b-datepicker
              v-model="$v.risk.riskEndDate.$model"
              :disabled="true"
              icon="calendar-check"
            ></b-datepicker>
          </b-field>
        </b-field>

        <b-field group-multiline grouped>
          <!-- Expiry Quarter -->
          <b-field class="mt-4" expanded label="Expiry Quarter">
            <b-input
              v-model="$v.risk.expiryQuarter.$model"
              :disabled="true"
            ></b-input>
          </b-field>

          <!-- Number of Days -->
          <b-field class="mt-4" expanded label="Number of Days">
            <b-input
              v-model="$v.risk.numberOfDays.$model"
              :disabled="true"
            ></b-input>
          </b-field>
        </b-field>

        <div v-if="risk.numberOfDays" class="py-1">
          <!-- <div class="py-1"> -->
          <h4 class="mt-4 title is-4">Totals</h4>
          <b-field group-multiline grouped>
            <b-field
              v-for="([key, value], index) in topComputedValues"
              :key="index"
              expanded
            >
              <template v-slot:label>
                <span>{{ key | startCase }}</span>
              </template>
              <b-input :disabled="true" :value="value"></b-input>
            </b-field>
          </b-field>

          <b-field group-multiline grouped>
            <b-field
              v-for="([key, value], index) in bottomComputedValues"
              :key="index"
              class="mt-4"
              expanded
            >
              <template v-slot:label>
                <span>{{ key | startCase }}</span>
              </template>
              <b-input :disabled="true" :value="value"></b-input>
            </b-field>
          </b-field>

          <b-field class="mt-6 buttons" position="is-centered">
            <b-button icon-left="upload" type="is-primary" @click="onRiskSubmit"
              >Add Risk
            </b-button>
            <b-button icon-left="reload" @click="onRiskReset">
              Reset Form
            </b-button>
          </b-field>
        </div>
      </div>

      <div v-if="addRisk" class="py-1"></div>

      <risks-table
        v-if="quotation.risks.length > 0"
        :risks="quotation.risks"
        class="mt-4"
        delete-risks
        @risk-deleted="onRiskDeleted"
      ></risks-table>

      <div v-if="submitQuote" class="mt-6 buttons">
        <b-button
          expanded
          icon-left="upload"
          native-type="submit"
          type="is-primary"
          >Submit Policy
        </b-button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import currency from 'currency.js'
import { VMoney } from 'v-money'
import PayDebitModal from '@/components/modals/pay-debit-modal'

import {
  alpha,
  alphaNum,
  helpers,
  maxValue,
  numeric,
  required,
} from 'vuelidate/lib/validators'

const name = helpers.regex('name', /^[a-zA-z\s]+/i)
const nameNum = helpers.regex('nameNum', /^[a-zA-z0-9\s]+/i)
const alphaSym = helpers.regex('alphaSym', /^[a-zA-z0-9\-_\s]+/i)
const yearOfManLength = helpers.regex('yearOfManLength', /^\d{4}$/)
const seatingCapLength = helpers.regex('seatingCapLength', /^\d{1,2}$/)
const cubicCapLength = helpers.regex('cubicCapLength', /^\d{3,4}$/)

export default {
  name: 'CreatePolicy',

  directives: { money: VMoney },

  middleware: 'auth',

  data() {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const minDate = new Date(today)
    return {
      minDate,

      policyToast: null,

      money: {
        decimal: '.',
        thousands: '',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: true,
      },

      clientName: '',
      color: '',
      valueTypeOptions: ['Rate', 'Amount'],

      // Quotations
      submitQuote: false,
      quotation: {
        clientCode: null,
        startDate: null,
        endDate: null,
        currency: null,
        quarter: null,
        risks: [],
      },

      // Risks
      addRisk: false,
      addRiskCsv: false,
      liabilityType: null,
      // Combined Limits
      combinedLimits: null,
      combinedLimitsRate: 0,
      combinedLimitsPremium: 0,
      // Death and injury per person
      deathAndInjuryPerPerson: null,
      deathAndInjuryPerPersonRate: 0,
      deathAndInjuryPerPersonPremium: 0,
      // Death and injury per event
      deathAndInjuryPerEvent: null,
      deathAndInjuryPerEventRate: 0,
      deathAndInjuryPerEventPremium: 0,
      // Property dmage
      propertyDamage: null,
      propertyDamageRate: 0,
      propertyDamagePremium: 0,
      // Discounts
      selectedDiscount: null,
      discountType: null,
      discountRate: null,
      discountAmount: null,
      // Extensions
      selectedExtension: null,
      extensionType: null,
      extensionAmount: null,

      risk: {
        riskStartDate: null,
        riskEndDate: null,
        riskQuarter: null,
        productType: null,
        insuranceType: 7002,
        sumInsured: null,
        // premiumRate: 6,
        // basicPremium: null,
        basicPremiumAmount: null,
        extensions: [],
        extensionsTotal: null,
        discounts: [],
        discountSubTotal: null,
        discountsTotal: null,
        premiumLevy: null,
        netPremium: null,
        numberOfDays: null,
        expiryQuarter: null,
        limitsOfLiability: [],
        excesses: [],
        vehicle: {
          vehicleMake: null,
          vehicleModel: null,
          yearOfManufacture: null,
          regNumber: null,
          engineNumber: null,
          chassisNumber: null,
          color: null,
          cubicCapacity: null,
          seatingCapacity: null,
          bodyType: null,
        },
      },
    }
  },

  computed: {
    // Clients
    ...mapGetters('clients', {
      clients: 'clientList',
      clientLoading: 'loading',
    }),

    filteredClients() {
      return this.clients.filter(({ text }) => {
        return text.toLowerCase().includes(this.clientName.toLowerCase())
      })
    },

    // Policies
    ...mapGetters('policies', {
      activePolicyRisks: 'activePolicyRisks',
      policyLoading: 'loading',
    }),

    // Quotations
    ...mapGetters('quotations', ['currencies', 'quarters', 'loading']),

    maxQuarter() {
      return this.quotation.quarter
    },

    // Risks
    ...mapGetters('risks', [
      'quarters',
      'productTypes',
      'levyRate',
      'vehicleBodyTypes',
    ]),

    ...mapGetters('discounts', ['discounts']),

    // Products
    // "productName": "Third Party Only",
    // "productCode": 7002,
    ...mapGetters('products', {
      insuranceTypes: 'products',
      tpExtensions: 'motorThirdPartyExtensions',
    }),

    ...mapGetters('liability-limits', [
      'liabilityTypes',
      'defaultDeathAndInjuryPerPersonMin',
      'defaultDeathAndInjuryPerEventMin',
      'defaultPropertyDamageMin',
      'defaultCombinedLimitsMin',
    ]),

    ...mapGetters('external-services', ['colors']),

    filteredColors() {
      return this.colors.filter((color) => {
        return color.toLowerCase().includes(this.color.toLowerCase())
      })
    },

    computedValues() {
      switch (this.quotation.currency) {
        case 'USD':
          return {
            basicPremium: this.$options.filters.currency_usd(
              this.risk.basicPremium
            ),
            increasedLimitsOfLiabilityPremium: this.$options.filters.currency_usd(
              this.limitsTotalPremium
            ),
            extension: this.$options.filters.currency_usd(
              this.risk.extensionsTotal
            ),
            discount: this.$options.filters.currency_usd(
              this.risk.discountsTotal
            ),
            premiumLevy: this.$options.filters.currency_usd(
              this.risk.premiumLevy
            ),
            netPremium: this.$options.filters.currency_usd(
              this.risk.netPremium
            ),
          }

        default:
          return {
            basicPremium: this.$options.filters.currency(
              this.risk.basicPremium
            ),
            increasedLimitsOfLiabilityPremium: this.$options.filters.currency(
              this.limitsTotalPremium
            ),
            extension: this.$options.filters.currency(
              this.risk.extensionsTotal
            ),
            discount: this.$options.filters.currency(this.risk.discountsTotal),
            premiumLevy: this.$options.filters.currency(this.risk.premiumLevy),
            netPremium: this.$options.filters.currency(this.risk.netPremium),
          }
      }
    },

    topComputedValues() {
      const arr = Object.entries(this.computedValues)
      return arr.filter((_, index) => index < 3)
    },

    bottomComputedValues() {
      const arr = Object.entries(this.computedValues)
      return arr.filter((_, index) => index >= 3)
    },

    validClient() {
      return this.$v.quotation.clientCode.$dirty
        ? !this.$v.quotation.clientCode.$invalid
        : null
    },

    // Policy detail validations
    clientState() {
      if (this.$v.quotation.clientCode.$dirty) {
        return this.validClient ? 'is-success' : 'is-danger'
      }

      return null
    },

    validStartDate() {
      return this.$v.quotation.startDate.$dirty
        ? !this.$v.quotation.startDate.$invalid
        : null
    },

    startDateState() {
      if (this.$v.quotation.startDate.$dirty) {
        return this.validStartDate ? 'is-success' : 'is-danger'
      }

      return null
    },

    validQuarter() {
      return this.$v.quotation.quarter.$dirty
        ? !this.$v.quotation.quarter.$invalid
        : null
    },

    quarterState() {
      if (this.$v.quotation.quarter.$dirty) {
        return this.validQuarter ? 'is-success' : 'is-danger'
      }

      return null
    },

    validCurrency() {
      return this.$v.quotation.currency.$dirty
        ? !this.$v.quotation.currency.$invalid
        : null
    },

    currencyState() {
      if (this.$v.quotation.currency.$dirty) {
        return this.validCurrency ? 'is-success' : 'is-danger'
      }

      return null
    },

    // Risk validations
    validVehicleMake() {
      return this.$v.risk.vehicle.vehicleMake.$dirty
        ? !this.$v.risk.vehicle.vehicleMake.$invalid
        : null
    },

    vehMakeState() {
      if (this.$v.risk.vehicle.vehicleMake.$dirty) {
        return this.validVehicleMake ? 'is-success' : 'is-danger'
      }

      return null
    },

    validVehicleModel() {
      return this.$v.risk.vehicle.vehicleModel.$dirty
        ? !this.$v.risk.vehicle.vehicleModel.$invalid
        : null
    },

    vehModelState() {
      if (this.$v.risk.vehicle.vehicleModel.$dirty) {
        return this.validVehicleModel ? 'is-success' : 'is-danger'
      }

      return null
    },

    validYearOfManufacture() {
      return this.$v.risk.vehicle.yearOfManufacture.$dirty
        ? !this.$v.risk.vehicle.yearOfManufacture.$invalid &&
            this.$v.risk.vehicle.yearOfManufacture.$model <=
              this.minDate.getFullYear()
        : null
    },

    yearOfManState() {
      if (this.$v.risk.vehicle.yearOfManufacture.$dirty) {
        return this.validYearOfManufacture ? 'is-success' : 'is-danger'
      }

      return null
    },

    validRegNumber() {
      if (this.$v.risk.vehicle.regNumber.$dirty) {
        const test = this.activePolicyRisks.some((risk) => {
          return (
            risk.vehicle.regNumber.replace(/\s/g, '').toLowerCase() ===
            this.$v.risk.vehicle.regNumber.$model.toLowerCase()
          )
        })

        if (test)
          this.$buefy.toast.open({
            message: `Error: A vehicle with this registration number is already part of an active policy!`,
            duration: 5000,
            position: 'is-top',
            type: 'is-danger',
          })

        return !this.$v.risk.vehicle.regNumber.$invalid && !test
      }

      return null
    },

    regNumberState() {
      if (this.$v.risk.vehicle.regNumber.$dirty) {
        return this.validRegNumber ? 'is-success' : 'is-danger'
      }

      return null
    },

    validEngineNumber() {
      if (this.$v.risk.vehicle.engineNumber.$dirty) {
        const test = this.activePolicyRisks.some((risk) => {
          return (
            risk.vehicle.engineNumber.toLowerCase() ===
            this.$v.risk.vehicle.engineNumber.$model.toLowerCase()
          )
        })

        if (test)
          this.$buefy.toast.open({
            duration: 5000,
            message: `Error: A vehicle with this engine number is already part of an active policy!`,
            position: 'is-top',
            type: 'is-danger',
          })

        return !this.$v.risk.vehicle.engineNumber.$invalid && !test
      }

      return null
    },

    engNumState() {
      if (this.$v.risk.vehicle.engineNumber.$dirty) {
        return this.validEngineNumber ? 'is-success' : 'is-danger'
      }

      return null
    },

    validChassisNumber() {
      if (this.$v.risk.vehicle.chassisNumber.$dirty) {
        const test = this.activePolicyRisks.some((risk) => {
          return (
            risk.vehicle.chassisNumber.toLowerCase() ===
            this.$v.risk.vehicle.chassisNumber.$model.toLowerCase()
          )
        })

        if (test)
          this.$buefy.toast.open({
            message: `Error: A vehicle with this chassis number is already part of an active policy!`,
            duration: 5000,
            position: 'is-top',
            type: 'is-danger',
          })

        return !this.$v.risk.vehicle.chassisNumber.$invalid && !test
      }

      return null
    },

    chassisNumState() {
      if (this.$v.risk.vehicle.chassisNumber.$dirty) {
        return this.validChassisNumber ? 'is-success' : 'is-danger'
      }

      return null
    },

    validColor() {
      return this.$v.risk.vehicle.color.$dirty
        ? !this.$v.risk.vehicle.color.$invalid
        : null
    },

    colorState() {
      if (this.$v.risk.vehicle.color.$dirty) {
        return this.validColor ? 'is-success' : 'is-danger'
      }

      return null
    },

    validCubicCapacity() {
      return this.$v.risk.vehicle.cubicCapacity.$dirty
        ? !this.$v.risk.vehicle.cubicCapacity.$invalid
        : null
    },

    ccState() {
      if (this.$v.risk.vehicle.cubicCapacity.$dirty) {
        return this.validCubicCapacity ? 'is-success' : 'is-danger'
      }

      return null
    },

    validSeatingCapacity() {
      return this.$v.risk.vehicle.seatingCapacity.$dirty
        ? !this.$v.risk.vehicle.seatingCapacity.$invalid
        : null
    },

    seatCapState() {
      if (this.$v.risk.vehicle.seatingCapacity.$dirty) {
        return this.validSeatingCapacity ? 'is-success' : 'is-danger'
      }

      return null
    },

    validBodyType() {
      return this.$v.risk.vehicle.bodyType.$dirty
        ? !this.$v.risk.vehicle.bodyType.$invalid
        : null
    },

    bodyState() {
      if (this.$v.risk.vehicle.bodyType.$dirty) {
        return this.validBodyType ? 'is-success' : 'is-danger'
      }

      return null
    },

    validProductType() {
      return this.$v.risk.productType.$dirty
        ? !this.$v.risk.productType.$invalid
        : null
    },

    productTypeState() {
      if (this.$v.risk.productType.$dirty) {
        return this.validProductType ? 'is-success' : 'is-danger'
      }

      return null
    },

    validRiskStartDate() {
      return this.$v.risk.riskStartDate.$dirty
        ? !this.$v.risk.riskStartDate.$invalid
        : null
    },

    riskStartDateState() {
      if (this.$v.risk.riskStartDate.$dirty) {
        return this.validRiskStartDate ? 'is-success' : 'is-danger'
      }

      return null
    },

    validRiskQuarter() {
      return this.$v.risk.riskQuarter.$dirty
        ? !this.$v.risk.riskQuarter.$invalid
        : // && this.$v.risk.riskQuarter.$model <= this.quotation.quarter
          null
    },

    riskQuarterState() {
      if (this.$v.risk.riskQuarter.$dirty) {
        return this.validRiskQuarter ? 'is-success' : 'is-danger'
      }

      return null
    },
  },

  validations() {
    return {
      quotation: {
        clientCode: { required },
        startDate: { required },
        endDate: { required },
        currency: { required, alpha },
        quarter: { required, numeric },
      },

      // Risk model
      risk: {
        insuranceType: { required },
        productType: { required },
        riskStartDate: { required },
        riskQuarter: {
          required,
          quarter: maxValue(this.maxQuarter),
        },
        riskEndDate: { required },
        expiryQuarter: { required },
        numberOfDays: { required, numeric },
        vehicle: {
          vehicleMake: { required, name },
          vehicleModel: { required, nameNum },
          yearOfManufacture: { required, yearOfManLength },
          regNumber: { required, alphaNum },
          engineNumber: { required, alphaSym },
          chassisNumber: { required, alphaSym },
          color: { required, name },
          cubicCapacity: { required, cubicCapLength },
          seatingCapacity: { required, seatingCapLength },
          bodyType: { required },
        },
      },
    }
  },

  async created() {
    await this.loadClients()
    // await this.loadClasses()
    // await this.loadProducts()
    await this.loadPolicies()
    await this.loadTransactions()
    // await this.loadColors()
  },

  mounted() {
    this.resetFormHelpers()
  },

  methods: {
    ...mapActions('quotations', [
      'submit',
      'setHighestQuarter',
      'selectQuotation',
    ]),

    ...mapActions('transactions', { loadTransactions: 'load' }),

    // ...mapActions('classes', { loadClasses: 'load' }),

    // ...mapActions('products', { loadProducts: 'load' }),

    ...mapActions('helpers', ['setCurrency']),

    ...mapActions('policies', {
      loadPolicies: 'load',
      createPolicy: 'createPolicy',
      selectPolicy: 'load',
    }),

    ...mapActions('clients', { loadClients: 'load' }),

    ...mapActions('risks', {
      pushRiskToState: 'addRisk',
      removeRiskFromState: 'deleteRisk',
      refreshRisks: 'refreshRisks',
    }),

    ...mapActions('external-services', {
      // loadColors: 'load',
      addColor: 'addColor',
    }),

    clientSelected(option, event) {
      this.$v.quotation.clientCode.$touch()
      if (option) this.quotation.clientCode = option.value
      if (!event) this.quotation.clientCode = null
    },

    colorSelected(color, event) {
      this.$v.risk.vehicle.color.$touch()
      if (color) this.risk.vehicle.color = color
      if (!event) this.risk.vehicle.color = null
    },

    showAddColor() {
      this.$buefy.dialog.prompt({
        message: `Color`,
        inputAttrs: {
          placeholder: 'e.g. Army Green',
          maxlength: 20,
          value: this.color,
        },
        confirmText: 'Add',

        onConfirm: (value) => {
          this.addColor(value)
          this.$refs.colorComplete.setSelected(value)
          this.$v.risk.vehicle.color.$model = value
        },
      })
    },

    // Policy details
    // Handle start date change
    onStartDateChange(startDate) {
      try {
        if (this.quotation.quarter) {
          this.calculateEndDate()
        }
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    onQuarterChange(quarter) {
      try {
        if (!this.quotation.startDate) {
          throw new Error('Please select a start date')
        }

        this.setHighestQuarter(quarter)

        this.calculateEndDate()
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    // Caluclate end date
    calculateEndDate() {
      const quarter = this.quotation.quarter
      const startDate = DateTime.fromISO(this.quotation.startDate.toISOString())

      const endOfStartDateQuarter = startDate.endOf('quarter')
      const endDate =
        quarter > 1
          ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
          : endOfStartDateQuarter

      this.quotation.startDate = new Date(startDate.toISO())
      this.quotation.endDate = new Date(endDate.endOf('day').toISO())
    },

    selectClient() {
      this.quotation.clientCode = this.selectedClient.id
    },

    // Risk details
    // Handle change for product type
    onProductTypeChange() {
      if (this.risk.productType && this.risk.insuranceType === 7002) {
        this.thirdPartyPremium()
      }
    },

    // Handle start date change
    onRiskStartDateChange(startDate) {
      try {
        if (this.risk.riskQuarter) {
          if (this.risk.discounts.length > 0) {
            this.resetRiskDiscounts()
          }

          this.calculateRiskEndDate()
        }
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    // Caluclate expiry quarter and end date
    onRiskQuarterChange(quarter) {
      try {
        if (!this.risk.riskStartDate) {
          throw new Error('Please select a start date')
        }

        if (this.risk.discounts.length > 0) {
          this.resetRiskDiscounts()
        }

        this.calculateRiskEndDate()
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    // Caluclate end date
    calculateRiskEndDate() {
      const quarter = this.risk.riskQuarter
      const startDate = DateTime.fromISO(this.risk.riskStartDate.toISOString())
      const endOfStartDateQuarter = startDate.endOf('quarter')
      const endDate =
        quarter > 1
          ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
          : endOfStartDateQuarter

      this.calculateNumberOfDays(startDate, endDate)

      this.calculatePremium()

      this.risk.expiryQuarter = `${endDate.quarter}/${endDate.year}`
      this.risk.riskStartDate = new Date(startDate.toISO())

      this.risk.riskEndDate = new Date(endDate.endOf('day').toISO())
    },

    // Add values in array
    sumArray(items) {
      return items.reduce(
        (sum, { amount }) => currency(sum).add(amount).value,
        0
      )
    },

    // Calculate number of days
    calculateNumberOfDays(startDate, endDate) {
      const { days } = endDate.diff(startDate, 'days').toObject()
      this.risk.numberOfDays = Math.round(days)
    },

    // Trigger premium calculation
    calculatePremium() {
      if (this.risk.productType) {
        this.thirdPartyPremium()
      }
    },

    // Calculate premium for third party insurance
    thirdPartyPremium() {
      if (this.risk.productType && this.risk.productType.includes('Private')) {
        if (this.risk.riskQuarter === 1) {
          this.risk.basicPremium = 165
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 2) {
          this.risk.basicPremium = 280
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 3) {
          this.risk.basicPremium = 370
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 4) {
          this.risk.basicPremium = 464
          this.computeTotals()
        }
      }

      if (
        this.risk.productType &&
        this.risk.productType.includes('Commercial')
      ) {
        if (this.risk.riskQuarter === 1) {
          this.risk.basicPremium = 199
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 2) {
          this.risk.basicPremium = 340
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 3) {
          this.risk.basicPremium = 452
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 4) {
          this.risk.basicPremium = 566
          this.computeTotals()
        }
      }

      if (this.risk.productType && this.risk.productType.includes('Taxi')) {
        if (this.risk.riskQuarter === 1) {
          this.risk.basicPremium = 270
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 2) {
          this.risk.basicPremium = 464
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 3) {
          this.risk.basicPremium = 618
          this.computeTotals()
        }
        if (this.risk.riskQuarter === 4) {
          this.risk.basicPremium = 772
          this.computeTotals()
        }
      }
    },

    // Calculate net premium including discounts and others
    computeTotals() {
      const extensionsSum =
        this.risk.extensions.length > 0
          ? this.sumArray(this.risk.extensions)
          : 0
      const discountsSum =
        this.risk.discounts.length > 0 ? this.sumArray(this.risk.discounts) : 0

      const premiumWithoutLevy = currency(this.risk.basicPremium)
        .add(extensionsSum)
        .subtract(discountsSum)
        .add(this.limitsTotalPremium).value

      const levyAmount = currency(premiumWithoutLevy).multiply(this.levyRate)
        .value

      const netPremium = currency(premiumWithoutLevy).add(levyAmount).value

      this.risk.extensionsTotal = extensionsSum
      this.risk.discountsTotal = discountsSum
      this.risk.premiumLevy = levyAmount
      this.risk.netPremium = netPremium
    },

    onRiskSubmit() {
      try {
        this.$v.risk.$touch()
        if (this.$v.risk.$error)
          throw new Error('Please check the form for errors')

        this.risk.limitsOfLiability = []

        if (this.liabilityType.includes('Standard')) {
          this.risk.limitsOfLiability.push({
            liabilityType: 'deathAndInjuryPerPerson',
            amount: this.deathAndInjuryPerPerson,
            rate: this.deathAndInjuryPerPersonRate,
            premium: this.deathAndInjuryPerPersonPremium,
          })

          this.risk.limitsOfLiability.push({
            liabilityType: 'deathAndInjuryPerEvent',
            amount: this.deathAndInjuryPerEvent,
            rate: this.deathAndInjuryPerEventRate,
            premium: this.deathAndInjuryPerEventPremium,
          })

          this.risk.limitsOfLiability.push({
            liabilityType: 'propertyDamage',
            amount: this.propertyDamage,
            rate: this.propertyDamageRate,
            premium: this.propertyDamagePremium,
          })
        } else {
          this.risk.limitsOfLiability.push({
            liabilityType: 'combinedLimits',
            amount: this.combinedLimits,
            rate: this.combinedLimitsRate,
            premium: this.combinedLimitsPremium,
          })
        }

        this.quotation.risks.push({
          ...this.risk,
          riskStartDate: this.risk.riskStartDate.toISOString(),
          riskEndDate: this.risk.riskEndDate.toISOString(),
        })
        this.addRisk = !this.addRisk
        this.submitQuote = true
        this.onRiskReset()
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    async onSubmit() {
      try {
        this.$v.quotation.$touch()
        if (this.$v.quotation.$error)
          throw new Error('Please check for errors in the form')

        await this.$buefy.dialog.confirm({
          title: 'Create Policy',
          message:
            'Are you sure you want to create a policy? Please ensure you have entered the <b>correct</b> information.',
          confirmText: 'Yes',
          type: 'is-warning',
          hasIcon: true,
          focusOn: 'confirm',
          closeOnConfirm: false,
          onConfirm: async (value, { close }) => {
            this.policyToast = this.$buefy.toast.open({
              message: `Creating policy, please wait...`,
              indefinite: true,
              type: 'is-info',
            })
            // submit quote
            const quote = await this.submit(this.quotation)

            // Select quote
            this.selectQuotation(quote)

            // Create policy
            const policy = await this.createPolicy()

            // Make payment
            this.selectPolicy(policy)

            if (this.policyToast) {
              this.policyToast.close()
              this.policyToast = null
            }

            this.$buefy.dialog.confirm({
              title: 'Make Payment',
              message: `Policy submitted! Would you like to make the payment now?`,
              confirmText: 'Yes',
              cancelText: 'Other Pending Payments',
              type: 'is-success',
              hasIcon: true,
              onConfirm: () => {
                setTimeout(() => {
                  this.$buefy.modal.open({
                    parent: this,
                    component: PayDebitModal,
                    hasModalCard: true,
                    focusOn: 'confirm',
                    canCancel: ['x'],
                    destroyOnHide: true,
                    customClass: '',
                    onCancel: () => {
                      this.$buefy.toast.open({
                        message: `Payment cancelled...`,
                        duration: 5000,
                        position: 'is-top',
                        type: 'is-info',
                      })
                    },
                  })
                }, 300)
              },
              onCancel: () => {
                this.$router.push({
                  path: '/receipts',
                  query: { activeTab: 1 },
                })
              },
            })

            close()
          },
        })
      } catch (error) {
        const msg = error.response ? error.response.data.message : error.message
        this.$buefy.toast.open({
          duration: 5000,
          message: `Error: ${msg}`,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    onRiskDeleted(index) {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Risk removed!`,
        position: 'is-top',
        type: 'is-info',
      })
      this.quotation.risks.splice(index, 1)
      this.submitQuote = !(this.quotation.risks.length === 0)
    },

    onRiskReset() {
      this.resetFormHelpers()
      this.risk = {
        riskStartDate: null,
        riskEndDate: null,
        riskQuarter: null,
        productType: null,
        insuranceType: 7002,
        sumInsured: null,
        // premiumRate: 6,
        // basicPremium: null,
        basicPremiumAmount: null,
        extensions: [],
        extensionsTotal: null,
        discounts: [],
        discountSubTotal: null,
        discountsTotal: null,
        premiumLevy: null,
        netPremium: null,
        numberOfDays: null,
        expiryQuarter: null,
        limitsOfLiability: [],
        excesses: [],
        vehicle: {
          vehicleMake: null,
          vehicleModel: null,
          yearOfManufacture: null,
          regNumber: null,
          engineNumber: null,
          chassisNumber: null,
          color: null,
          cubicCapacity: null,
          seatingCapacity: null,
          bodyType: null,
        },
      }
      this.$v.risk.$reset()
    },

    resetFormHelpers() {
      // this.basicPremiumType = null
      this.liabilityType = 'Standard'
      // Third party liability limits
      this.combinedLimits = this.defaultCombinedLimitsMin
      this.combinedLimitsRate = 0
      this.combinedLimitsPremium = 0
      // Death and injury per person
      this.deathAndInjuryPerPerson = this.defaultDeathAndInjuryPerPersonMin
      this.deathAndInjuryPerPersonRate = 0
      this.deathAndInjuryPerPersonPremium = 0
      // Death and injury per event
      this.deathAndInjuryPerEvent = this.defaultDeathAndInjuryPerEventMin
      this.deathAndInjuryPerEventRate = 0
      this.deathAndInjuryPerEventPremium = 0
      // Property dmage
      this.propertyDamage = this.defaultPropertyDamageMin
      this.propertyDamageRate = 0
      this.propertyDamagePremium = 0
      // Discounts
      this.selectedDiscount = null
      this.discountType = null
      this.discountRate = null
      this.discountAmount = null
      // Extensions
      this.selectedExtension = null
      this.extensionType = null
      this.extensionAmount = null
    },

    reloadComponent() {
      this.quotation = {
        clientCode: null,
        startDate: null,
        endDate: null,
        currency: null,
        quarter: null,
        risks: [],
      }
      this.clientName = ''
      this.onRiskReset()
      this.color = ''
      this.$v.$reset()
    },

    currencySet(value) {
      this.setCurrency(value)
    },
  },
}
</script>
