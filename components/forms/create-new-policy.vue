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
      <b-field grouped group-multiline>
        <!-- Client -->
        <b-field expanded>
          <template v-slot:label>
            Client <span class="has-text-danger">*</span>
          </template>
          <b-autocomplete
            v-model="clientName"
            placeholder="e.g. John"
            open-on-focus
            clearable
            icon="account"
            :data="filteredClients"
            field="text"
            @select="clientSelected"
          >
            <!-- <template v-slot:header>
                <a @click="showAddColor">
                  <span>Add color...</span>
                </a>
              </template> -->
            <template v-slot:empty>
              No results for {{ clientName }}
            </template></b-autocomplete
          >
        </b-field>

        <!-- Start date -->
        <b-field expanded>
          <template v-slot:label>
            Start Date <span class="has-text-danger">*</span>
          </template>
          <b-datepicker
            v-model="quotation.startDate"
            placeholder="-- Please select start date --"
            icon="calendar-blank-outline"
            :min-date="minDate"
            mobile-native
            @input="onStartDateChange"
          ></b-datepicker>
        </b-field>

        <!-- End date -->
        <b-field expanded>
          <template v-slot:label> End Date </template>
          <b-datepicker
            v-model="quotation.endDate"
            icon="calendar-check"
            :disabled="true"
          ></b-datepicker>
        </b-field>
      </b-field>

      <b-field class="mb-4" grouped group-multiline>
        <!-- Currency -->
        <b-field class="mt-4" expanded>
          <template v-slot:label>
            Currency <span class="has-text-danger">*</span>
          </template>
          <b-select
            v-model="quotation.currency"
            placeholder="-- Please select a currency --"
            icon="cash"
            expanded
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
        <b-field class="mt-4" expanded>
          <template v-slot:label>
            Quarters <span class="has-text-danger">*</span>
          </template>
          <b-select
            v-model="quotation.quarter"
            placeholder="-- Please select a quarter --"
            expanded
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
    <!-- <div v-if="quotation.quarter" class="card"> -->
    <div class="card">
      <div class="card-header">
        <h4 class="card-header-title is-4">Vehicle Details</h4>
        <span class="card-header-icon">
          <b-icon icon="car"></b-icon>
        </span>
      </div>
    </div>
    <!-- <div v-if="quotation.quarter" class="mt-4 box"> -->
    <div class="mt-4 box">
      <b-button
        v-if="!addRisk && quotation.quarter"
        type="is-primary"
        icon-left="plus"
        @click="addRisk = !addRisk"
        >Add Vehicle</b-button
      >

      <div v-if="addRisk">
        <h4 class="title is-4">Particulars of Vehicle</h4>
        <b-field grouped group-multiline>
          <!-- Vehicle Make -->
          <b-field expanded>
            <template v-slot:label>
              Vehicle Make <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="risk.vehicle.vehicleMake"
              placeholder="Toyota"
            ></b-input>
          </b-field>

          <!-- Vehicle Model -->
          <b-field expanded>
            <template v-slot:label>
              Vehicle Model <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="risk.vehicle.vehicleModel"
              placeholder="Corolla"
            ></b-input>
          </b-field>

          <!-- Year of Make -->
          <b-field expanded>
            <template v-slot:label>
              Year of Make <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="risk.vehicle.yearOfManufacture"
              v-mask="'####'"
              placeholder="2005"
            ></b-numberinput>
          </b-field>
        </b-field>
        <b-field grouped group-multiline>
          <!-- Registration Number -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Registration Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="risk.vehicle.regNumber"
              placeholder="ABC123ZM"
            ></b-input>
          </b-field>

          <!-- Engine Number -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Engine Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="risk.vehicle.engineNumber"
              placeholder="Engine number"
            ></b-input>
          </b-field>

          <!-- Chassis Number -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Chassis Number <span class="has-text-danger">*</span>
            </template>
            <b-input
              v-model="risk.vehicle.chassisNumber"
              placeholder="Chassis Number"
            ></b-input>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <!-- Color -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Color <span class="has-text-danger">*</span>
            </template>
            <b-autocomplete
              ref="colorComplete"
              v-model="color"
              placeholder="Pearl"
              open-on-focus
              clearable
              icon="paint"
              :data="filteredColors"
              @select="colorSelected"
            >
              <template v-slot:header>
                <a @click="showAddColor">
                  <span>Add color...</span>
                </a>
              </template>
              <template v-slot:empty> No results for {{ color }} </template>
            </b-autocomplete>
          </b-field>

          <!-- Cubic Capacity -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Cubic Capacity <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="risk.vehicle.cubicCapacity"
              v-mask="'####'"
              placeholder="1834"
            ></b-numberinput>
          </b-field>

          <!-- Seating Capacity -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Seating Capacity <span class="has-text-danger">*</span>
            </template>
            <b-numberinput
              v-model="risk.vehicle.seatingCapacity"
              v-mask="'##'"
              placeholder="5"
            ></b-numberinput>
          </b-field>
        </b-field>

        <b-field class="mb-4" grouped group-multiline>
          <!-- Body Type -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Body Type <span class="has-text-danger">*</span>
            </template>
            <b-select placeholder="-- Please select a body type --">
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
        <h4 class="title is-4 mt-4">Computations</h4>
        <b-field grouped group-multiline>
          <!-- Sum Insured -->
          <b-field label="Sum Insured">
            <!-- <b-field label="Sum Insured" exapanded> -->
            <p class="control">
              <span class="button is-static">{{ quotation.currency }}</span>
            </p>
            <b-input
              v-model="risk.sumInsured"
              v-money="money"
              placeholder="Sum insured"
              expanded
            ></b-input>
            <!-- <b-numberinput
              v-model="risk.sumInsured"
              v-mask="'###########'"
              placeholder="Sum insured"
            ></b-numberinput> -->
          </b-field>

          <!-- Product Type -->
          <b-field expanded>
            <template v-slot:label>
              Class of Vehicle <span class="has-text-danger">*</span>
            </template>
            <b-select
              v-model="risk.productType"
              placeholder="-- Please select a vehicle class --"
              expanded
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

        <b-field grouped group-multiline>
          <!-- Risk Start date -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Risk Start Date <span class="has-text-danger">*</span>
            </template>
            <b-datepicker
              v-model="risk.riskStartDate"
              placeholder="-- Please select start date --"
              icon="calendar-blank-outline"
              :min-date="minDate"
              mobile-native
              @input="onRiskStartDateChange"
            ></b-datepicker>
          </b-field>

          <!-- Risk Quarters -->
          <b-field class="mt-4" expanded>
            <template v-slot:label>
              Risk Quarters <span class="has-text-danger">*</span>
            </template>
            <b-select
              v-model="risk.riskQuarter"
              placeholder="-- Please select a quarter --"
              expanded
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
            <template v-slot:label> Risk End Date </template>
            <b-datepicker
              v-model="risk.riskEndDate"
              icon="calendar-check"
              :disabled="true"
            ></b-datepicker>
          </b-field>
        </b-field>

        <b-field grouped group-multiline>
          <!-- Expiry Quarter -->
          <b-field class="mt-4" label="Expiry Quarter" expanded>
            <b-input v-model="risk.expiryQuarter" :disabled="true"></b-input>
          </b-field>

          <!-- Number of Days -->
          <b-field class="mt-4" label="Number of Days" expanded>
            <b-input v-model="risk.numberOfDays" :disabled="true"></b-input>
          </b-field>
        </b-field>

        <!-- Discounts -->
        <h5 class="title is-5 mt-6">Discounts</h5>
        <b-field grouped group-multiline>
          <b-field label="Discount">
            <b-select
              v-model="selectedDiscount"
              placeholder="-- Please select a discount --"
            >
              <option
                v-for="({ text, value }, index) in discounts"
                :key="index"
                :value="value"
              >
                {{ text }}
              </option>
            </b-select>
          </b-field>

          <!-- Selected discounts -->
          <b-field label="Selected Discounts" expanded>
            <b-taginput
              v-model="risk.discounts"
              field="discountType"
              placeholder="Add discounts to view them"
              readonly
              @remove="removeDiscount"
            ></b-taginput>
          </b-field>
        </b-field>

        <!-- Discount Form -->
        <!-- <form v-if="selectedDiscount" @submit.prevent="onDiscountSubmit"> -->
        <form
          id="discount-form"
          class="mt-5"
          @submit.prevent="onDiscountSubmit"
        >
          <b-field grouped group-multiline>
            <!-- Discount Type -->
            <b-field label="Discount Type">
              <b-select
                v-model="discountType"
                placeholder="-- Please select a discount type --"
              >
                <option
                  v-for="(type, index) in valueTypeOptions"
                  :key="index"
                  :value="type"
                >
                  {{ type }}
                </option>
              </b-select>
            </b-field>

            <!-- Discount Rate -->
            <b-field v-if="discountType === 'Rate'" label="Discount Rate">
              <b-input
                v-model="discountRate"
                v-money="money"
                expanded
              ></b-input>
              <p class="control">
                <span class="button is-static">%</span>
              </p>
              <p class="control">
                <b-button
                  type="is-primary"
                  label="Add Discount"
                  native-type="submit"
                ></b-button>
              </p>
            </b-field>

            <!-- Discount Amount -->
            <b-field v-if="discountType === 'Amount'" label="Discount Amount">
              <p class="control">
                <span class="button is-static">{{ quotation.currency }}</span>
              </p>
              <b-input
                v-model="discountAmount"
                v-money="money"
                expanded
              ></b-input>
              <p class="control">
                <b-button
                  type="is-primary"
                  label="Add Discount"
                  native-type="submit"
                ></b-button>
              </p>
            </b-field>
          </b-field>
        </form>

        <!-- Limits of Liability -->
        <h5 class="title is-5 mt-6">Limits of Liability</h5>
        <b-field>
          <template v-slot:label>
            Liability Type <span class="has-text-danger">*</span>
          </template>
          <b-select
            v-model="liabilityType"
            placeholder="-- Please select a liability type --"
          >
            <option
              v-for="(type, index) in liabilityTypes"
              :key="index"
              :value="type"
            >
              {{ type }}
            </option>
          </b-select>
        </b-field>

        <div v-if="liabilityType === 'Standard'">
          <b-field class="mt-5" grouped group-multiline>
            <!-- Death and Injury Per Person -->
            <b-field label="Death and Injury Per Person">
              <b-numberinput
                v-model="deathAndInjuryPerPerson"
                step=".01"
                expanded
                @input="onDeathAndInjuryPerPersonChange"
              ></b-numberinput>
            </b-field>

            <!-- Rate -->
            <b-field label="Rate">
              <b-numberinput
                v-model="deathAndInjuryPerPersonRate"
                step=".01"
                expanded
                @input="onDeathAndInjuryPerPersonChange"
              ></b-numberinput>
            </b-field>

            <!-- Premium -->
            <b-field label="Premium">
              <p class="control">
                <span class="button is-static">
                  {{ quotation.currency }}
                </span>
              </p>
              <b-input
                v-model="deathAndInjuryPerPersonPremium"
                :disabled="true"
                expanded
              ></b-input>
            </b-field>
          </b-field>

          <b-field class="mt-5" grouped group-multiline>
            <!-- Death and Injury Per Event -->
            <b-field label="Death and Injury Per Event">
              <b-numberinput
                v-model="deathAndInjuryPerEvent"
                step=".01"
                expanded
                @input="onDeathAndInjuryPerEventChange"
              ></b-numberinput>
            </b-field>

            <!-- Rate -->
            <b-field label="Rate">
              <b-numberinput
                v-model="deathAndInjuryPerEventRate"
                step=".01"
                expanded
                @input="onDeathAndInjuryPerEventChange"
              ></b-numberinput>
            </b-field>

            <!-- Premium -->
            <b-field label="Premium">
              <p class="control">
                <span class="button is-static">
                  {{ quotation.currency }}
                </span>
              </p>
              <b-input
                v-model="deathAndInjuryPerEventPremium"
                :disabled="true"
                expanded
              ></b-input>
            </b-field>
          </b-field>

          <b-field class="mt-5" grouped group-multiline>
            <!-- Property Damage-->
            <b-field label="Property Damage">
              <b-numberinput
                v-model="propertyDamage"
                step=".01"
                expanded
                @input="onPropertyDamageChange"
              ></b-numberinput>
            </b-field>

            <!-- Rate -->
            <b-field label="Rate">
              <b-numberinput
                v-model="propertyDamageRate"
                step=".01"
                expanded
                @input="onPropertyDamageChange"
              ></b-numberinput>
            </b-field>

            <!-- Premium -->
            <b-field label="Premium">
              <p class="control">
                <span class="button is-static">
                  {{ quotation.currency }}
                </span>
              </p>
              <b-input
                v-model="propertyDamagePremium"
                :disabled="true"
                expanded
              ></b-input>
            </b-field>
          </b-field>
        </div>

        <b-field
          v-if="liabilityType === 'Third Party Liability Combined'"
          class="mt-5"
          grouped
          group-multiline
        >
          <!-- Combined Limit -->
          <b-field label="Third Party Combined Limit">
            <b-numberinput
              v-model="combinedLimits"
              step=".01"
              expanded
              @input="onCombinedLimitsChange"
            ></b-numberinput>
          </b-field>

          <!-- Rate -->
          <b-field label="Rate">
            <b-numberinput
              v-model="combinedLimitsRate"
              step=".01"
              expanded
              @input="onCombinedLimitsChange"
            ></b-numberinput>
          </b-field>

          <!-- Premium -->
          <b-field label="Premium">
            <p class="control">
              <span class="button is-static">
                {{ quotation.currency }}
              </span>
            </p>
            <b-input
              v-model="combinedLimitsPremium"
              :disabled="true"
              expanded
            ></b-input>
          </b-field>
        </b-field>

        <!-- <div v-if="risk.numberOfDays" class="py-1"> -->
        <div class="py-1">
          <h4 class="title is-4 mt-4">Totals</h4>
          <b-field grouped group-multiline>
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

          <b-field grouped group-multiline>
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

          <div class="mt-6 buttons">
            <b-button type="is-primary" icon-left="upload" @click="onRiskSubmit"
              >Add Risk</b-button
            >
            <b-button icon-left="reload" @click="onRiskReset">
              Reset Form
            </b-button>
          </div>
        </div>
      </div>

      <div v-if="addRisk" class="py-1"></div>

      <risks-table
        v-if="quotation.risks.length > 0"
        class="mt-4"
        :risks="quotation.risks"
        view-risks
        edit-risks
        delete-risks
        view-certificates
        @risk-deleted="onRiskDeleted"
      ></risks-table>
    </div>
  </form>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import currency from 'currency.js'
import { VMoney } from 'v-money'

// import {
//   alpha,
//   and,
//   decimal,
//   helpers,
//   minValue,
//   numeric,
//   or,
//   required,
//   requiredIf,
// } from 'vuelidate/lib/validators'
// const name = helpers.regex('name', /^[a-zA-z\s]+/i)
// const nameNum = helpers.regex('nameNum', /^[a-zA-z0-9\s]+/i)
// const alphaSym = helpers.regex('alphaSym', /^[a-zA-z0-9\-_\s]+/i)
// const decimalOrNum = or(decimal, numeric)

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
      quotation: {
        clientCode: null,
        startDate: null,
        endDate: null,
        currency: null,
        quarter: null,
        risks: [],
      },

      // Risks
      addRisk: true,
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
        return text.toString().toLowerCase().includes(this.clientName)
      })
    },

    // Policies
    ...mapGetters('policies', {
      activePolicyRisks: 'activePolicyRisks',
      policyLoading: 'loading',
    }),

    // Quotations
    ...mapGetters('quotations', ['currencies', 'quarters', 'loading']),

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
        return color.toString().toLowerCase().includes(this.color)
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
  },

  async created() {
    await this.loadPolicies()
    await this.loadClients()
    await this.loadColors()
  },

  mounted() {
    this.resetFormHelpers()
  },

  methods: {
    ...mapActions('quotations', ['submit', 'setHighestQuarter']),

    ...mapActions('helpers', ['setCurrency']),

    ...mapActions('policies', { loadPolicies: 'load' }),

    ...mapActions('clients', { loadClients: 'load' }),

    ...mapActions('external-services', ['addColor']),

    clientSelected(option) {
      if (option) this.quotation.clientCode = option.value
    },

    colorSelected(color) {
      if (color) this.risk.vehicle.color = color
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
        },
      })
    },

    ...mapActions('external-services', { loadColors: 'load' }),

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

    // Handle changes to death and injury per person values
    onDeathAndInjuryPerPersonChange() {
      if (
        this.deathAndInjuryPerPerson > this.defaultDeathAndInjuryPerPersonMin
      ) {
        const multiplicand = currency(this.deathAndInjueryPerPerson).subtract(
          this.defaultDeathAndInjuryPerPersonMin
        ).value
        const multiplier = currency(this.deathAndInjuryPerPersonRate).divide(
          100
        ).value
        this.deathAndInjuryPerPersonPremium = currency(multiplicand).multiply(
          multiplier
        ).value

        this.computeTotals()
      } else {
        this.deathAndInjuryPerPersonPremium = 0

        this.computeTotals()
      }
    },

    // Handle changes to death and injury per event
    onDeathAndInjuryPerEventChange() {
      if (this.deathAndInjuryPerEvent > this.defaultDeathAndInjuryPerEventMin) {
        const multiplicand = currency(this.deathAndInjuryPerEvent).subtract(
          this.defaultDeathAndInjuryPerEventMin
        ).value
        const multiplier = currency(this.deathAndInjuryPerEventRate).divide(100)
          .value
        this.deathAndInjuryPerEventPremium = currency(multiplicand).multiply(
          multiplier
        ).value

        this.computeTotals()
      } else {
        this.deathAndInjuryPerEventPremium = 0

        this.computeTotals()
      }
    },

    // Hanlde changes to property damage
    onPropertyDamageChange() {
      if (this.propertyDamage > this.defaultPropertyDamageMin) {
        const multiplicand = currency(this.propertyDamage).subtract(
          this.defaultPropertyDamageMin
        ).value
        const multiplier = currency(this.propertyDamageRate).divide(100).value
        this.propertyDamagePremium = currency(multiplicand).multiply(
          multiplier
        ).value

        this.computeTotals()
      } else {
        this.propertyDamagePremium = 0

        this.computeTotals()
      }
    },

    // Handle changes to combined limits
    onCombinedLimitsChange() {
      if (this.combinedLimits > this.defaultCombinedLimitsMin) {
        const multiplicand = currency(this.combinedLimits).subtract(
          this.defaultCombinedLimitsMin
        ).value
        const multiplier = currency(this.combinedLimitsRate).divide(100).value
        this.combinedLimitsPremium = currency(multiplicand).multiply(
          multiplier
        ).value

        this.computeTotals()
      } else {
        this.combinedLimitsPremium = 0

        this.computeTotals()
      }
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

    // Handle discount array
    onDiscountSubmit() {
      try {
        if (!this.risk.basicPremium) {
          throw new Error(
            `You cannot apply a discount before calculating the premium!`
          )
        }

        if (!this.selectedDiscount.discountType.includes('Claims')) {
          throw new Error(
            `Only a 'No Claims Discount' can be applied to the Third Party Policy`
          )
        }

        let rate, amount
        if (this.discountType.includes('Rate')) {
          rate = currency(this.discountRate).divide(100).value
          amount = currency(rate).multiply(this.risk.basicPremium).value
        } else {
          amount = currency(this.discountAmount).value
        }

        const discountToPush = {
          ...this.selectedDiscount,
          amount,
        }

        this.risk.discounts.push(discountToPush)

        this.$buefy.toast.open({
          duration: 5000,
          message: `${this.selectedDiscount.discountType} added successfully!`,
          position: 'is-top',
          type: 'is-success',
        })

        this.onDiscountReset()
        this.computeTotals()
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    // Reset discount
    resetRiskDiscounts() {
      this.risk.discounts = []
      this.risk.discountsTotal = 0
      this.$buefy.toast.open({
        duration: 5000,
        message: `Discounts removed owing to premium recalculation`,
        position: 'is-top',
        type: 'is-info',
      })
    },

    // Handle extensions array
    onExtensionSubmit() {
      try {
        if (!this.risk.basicPremium) {
          throw new Error(
            `You cannot apply an extension before calculating the premium!`
          )
        }

        const amount = currency(this.extensionAmount).value

        const extensionToPush = {
          ...this.selectedExtension,
          amount,
        }

        this.risk.extensions.push(extensionToPush)

        this.$buefy.toast.open({
          duration: 5000,
          message: `${this.selectedExtension.extensionType} added successfully!`,
          position: 'is-top',
          type: 'is-success',
        })

        this.onExtensionReset()
        this.computeTotals()
      } catch ({ message }) {
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    // Delete discount from array
    removeDiscount(discount) {
      this.$buefy.toast.open({
        duration: 5000,
        message: `${discount.discountType} removed!`,
        position: 'is-top',
        type: 'is-info',
      })
      this.computeTotals()
    },

    // Delete extension from array
    removeExtension(index) {
      this.$buefy.toast.open({
        duration: 5000,
        message: `${this.risk.extensions[index].extensionType} removed!`,
        position: 'is-top',
        type: 'is-info',
      })
      this.risk.extensions.splice(index, 1)
      this.computeTotals()
    },

    onRiskSubmit() {
      try {
        this.$v.risk.$touch()
        if (this.$v.risk.$error) throw new Error('Please check the risk form')

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

        this.quotation.risks.push(this.risk)
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

        await this.submit(this.quotation)

        this.$buefy.toast.open({
          duration: 5000,
          message: `Quote submitted!`,
          position: 'is-top',
          type: 'is-success',
        })

        this.$router.push({ name: 'Manage Quotations' })
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
      // this.quotation.risks.splice(index, 1)
      // this.submitQuote = !(this.quotation.risks.length === 0)
      console.info('Deleting risk:', index)
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
      this.liabilityType = null
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

    onDiscountReset() {
      this.discountRate = null
      this.discountAmount = null
      this.discountType = null
      this.selectedDiscount = null
    },

    onExtensionReset() {
      this.extensionAmount = null
      this.selectedExtension = null
    },

    currencySet(value) {
      this.setCurrency(value)
    },
  },
}
</script>
