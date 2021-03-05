<template>
  <div>
    <!-- Policy Details -->
    <div class="block card">
      <div class="card-header">
        <h4 class="card-header-title is-4">Policy Details</h4>
        <span class="card-header-icon">
          <b-icon icon="note-text-outline"></b-icon>
        </span>
      </div>
    </div>

    <FormulateForm
      id="policy"
      v-model="form"
      name="policy"
      :class="['block box']"
      @submit="onSubmit"
    >
      <!-- Client Type Row -->
      <div class="columns">
        <!-- First Row -->

        <!-- Client -->
        <div class="column">
          <FormulateInput
            v-model="clientID"
            name="clientID"
            type="autocomplete"
            label="Client"
            field="label"
            icon="account"
            placeholder="e.g. John"
            validation="required"
            :options="clients"
            @selected="clientSelected"
          />
        </div>

        <!-- Currency -->
        <div class="column">
          <FormulateInput
            v-model="currency"
            type="select"
            label="Currency"
            name="currency"
            placeholder="-- Please select a currency --"
            validation="required"
            data-is-expanded
            :options="currencies"
            :disabled="!clientID"
          />
        </div>

        <!-- Quarters -->
        <div class="column">
          <FormulateInput
            v-model="numOfQuarters"
            type="select"
            label="Quarters"
            name="numOfQuarters"
            placeholder="-- Please select a quarter --"
            validation="required"
            data-is-expanded
            :options="quarters"
            :disabled="!currency"
          />
        </div>
      </div>

      <!-- Second Row -->
      <div class="columns">
        <!-- Start date -->
        <div class="column is-one-third">
          <FormulateInput
            v-model="startDate"
            type="datepicker"
            label="Start Date"
            name="startDate"
            placeholder="-- Please select start date --"
            validation="required"
            :disabled="!numOfQuarters"
            :min-date="minDate"
          />
        </div>

        <!-- End date -->
        <div class="column is-one-third">
          <FormulateInput
            v-model="endDate"
            type="datepicker"
            label="End Date"
            name="endDate"
            :disabled="true"
          />
        </div>
      </div>
    </FormulateForm>

    <!-- Vehicle Details -->
    <div v-if="startDate" class="block card">
      <div class="card-header">
        <h4 class="card-header-title is-4">Vehicle Details</h4>
        <span class="card-header-icon">
          <b-icon icon="car"></b-icon>
        </span>
      </div>
    </div>
    <FormulateForm
      v-if="startDate"
      id="vehicle"
      v-model="vehicle"
      name="vehicle"
      :class="['block box']"
      @submit="onVehicleSubmit"
    >
      <b-tabs v-model="activeTab" expanded position="is-left" type="is-toggle">
        <b-tab-item label="+ Add Vehicle">
          <!-- <div class="buttons">
            <b-button
              v-if="!addVehicle && numOfQuarters"
              icon-left="plus"
              type="is-primary"
              label="Add Vehicle"
              @click="toggleVehicleAddition"
            />
          </div> -->
          <div>
            <!-- First Row -->
            <div class="columns">
              <!-- Vehicle Make -->
              <div class="column">
                <FormulateInput
                  v-model="make"
                  type="text"
                  label="Vehicle Make"
                  name="vehicleMake"
                  placeholder="Toyota"
                  validation="bail|required|matches:/^[a-zA-z\s]+/"
                />
              </div>

              <!-- Vehicle Model -->
              <div class="column">
                <FormulateInput
                  v-model="model"
                  type="text"
                  label="Vehicle Model"
                  name="vehicleModelName"
                  placeholder="Corolla"
                  validation="bail|required|matches:/^[a-zA-z\s]+/"
                  :disabled="!make"
                />
              </div>

              <!-- Year of Manufacture -->
              <div class="column">
                <FormulateInput
                  v-model="yearOfManufacture"
                  type="text"
                  label="Year of Manufacture"
                  name="yearOfManufacture"
                  placeholder="2005"
                  :disabled="!model"
                  validation="bail|required|number|min:4,length|max:4,length"
                />
              </div>
            </div>

            <!-- Second Row -->
            <div class="columns">
              <!-- Registration Number -->
              <div class="column">
                <FormulateInput
                  v-model="regNumber"
                  type="text"
                  label="Registration Number"
                  name="vehicleRegNumber"
                  placeholder="ABC123ZM"
                  validation="bail|required|alphanumeric|valid_reg_number"
                  :disabled="!yearOfManufacture"
                  :validation-rules="{ validRegNumber }"
                  :validation-messages="{
                    validRegNumber:
                      'A vehicle with this registration number is already part of an active policy.',
                  }"
                />
              </div>

              <!-- Engine Number -->
              <div class="column">
                <FormulateInput
                  v-model="engineNumber"
                  type="text"
                  label="Engine Number"
                  name="vehicleEngineNumber"
                  placeholder="Engine number"
                  validation="bail|required|valid_engine_number|matches:/^[a-zA-z\s]+/"
                  :disabled="!regNumber"
                  :validation-rules="{ validEngineNumber }"
                  :validation-messages="{
                    validEngineNumber:
                      'A vehicle with this engine number is already part of an active policy.',
                  }"
                />
              </div>

              <!-- Chassis Number -->
              <div class="column">
                <FormulateInput
                  v-model="chassisNumber"
                  type="text"
                  label="Chassis Number"
                  name="vehicleChassisNumber"
                  placeholder="Chassis number"
                  validation="bail|required|valid_chassis_number|matches:/^[a-zA-z\s]+/"
                  :disabled="!engineNumber"
                  :validation-rules="{ validChassisNumber }"
                  :validation-messages="{
                    validChassisNumber:
                      'A vehicle with this chassis number is already part of an active policy.',
                  }"
                />
              </div>
            </div>

            <!-- Third Row -->
            <div class="columns">
              <!-- Colour -->
              <div class="column">
                <FormulateInput
                  v-model="color"
                  name="vehicleColour"
                  type="autocomplete"
                  label="Color"
                  icon="palette"
                  placeholder="Pearl"
                  validation="required"
                  data-ref="colorComplete"
                  data-additional-prompt="Add color"
                  :options="colors"
                  :disabled="!chassisNumber"
                />
              </div>

              <!-- Cubic Capacity -->
              <div class="column">
                <FormulateInput
                  v-model="cubicCapacity"
                  type="text"
                  label="Cubic Capacity"
                  name="cubicCapacity"
                  placeholder="1834"
                  :disabled="color === null"
                  validation="bail|required|number|min:3,length|max:4,length"
                />
              </div>

              <!-- Seating Capacity -->
              <div class="column">
                <FormulateInput
                  v-model="seatCapacity"
                  type="text"
                  label="Seating Capacity"
                  name="seatCapacity"
                  placeholder="5"
                  :disabled="!cubicCapacity"
                  validation="bail|required|number|max:2,length"
                />
              </div>
            </div>

            <!-- Fourth Row -->
            <div class="columns">
              <!-- Product Type -->
              <div class="column">
                <FormulateInput
                  v-model="productTypeID"
                  type="select"
                  label="Product Type"
                  name="productTypeID"
                  placeholder="-- Please select a product type --"
                  validation="required"
                  data-is-expanded
                  :options="productTypes"
                  :disabled="!seatCapacity"
                />
              </div>

              <!-- Body Type -->
              <div class="column">
                <FormulateInput
                  v-model="bodyType"
                  type="select"
                  label="Body Type"
                  name="bodyType"
                  placeholder="-- Please select a body type --"
                  validation="required"
                  data-is-expanded
                  :disabled="!seatCapacity"
                  :options="bodyTypes"
                />
              </div>

              <!-- Certificate Number -->
              <div class="column">
                <FormulateInput
                  v-model="certificateNumber"
                  type="text"
                  label="Certificate Number"
                  name="certificateNumber"
                  placeholder="Cover note certificate number"
                  validation="required|number"
                  :disabled="!bodyType"
                />
              </div>
            </div>

            <!-- Fifth Row -->
            <div class="columns">
              <!-- Vehicle quarters -->
              <div class="column">
                <FormulateInput
                  v-model="vehicleNumOfQuarters"
                  type="select"
                  label="Quarters"
                  name="vehicleNumOfQuarters"
                  placeholder="-- Please select a quarter --"
                  data-is-expanded
                  :validation="[['required'], ['max', numOfQuarters, 'value']]"
                  :validation-messages="{
                    max: `The number of quarters cannot be more than the policy's number of quarters: ${numOfQuarters}.`,
                  }"
                  :options="quarters"
                  :disabled="!certificateNumber"
                />
              </div>

              <!-- Vehicle Start date -->
              <div class="column">
                <FormulateInput
                  v-model="vehicleStartDate"
                  type="datepicker"
                  label="Start Date"
                  name="startDate"
                  placeholder="-- Please select start date --"
                  validation="required"
                  :disabled="!vehicleNumOfQuarters"
                  :min-date="minDate"
                />
              </div>

              <!-- Vehicle End date -->
              <div class="column">
                <FormulateInput
                  v-model="vehicleEndDate"
                  type="datepicker"
                  label="End Date"
                  name="endDate"
                  :disabled="true"
                />
              </div>
            </div>

            <!-- Computations -->

            <!-- Final Row -->
            <div class="columns is-centered">
              <div class="column is-half">
                <div class="buttons is-centered has-addons">
                  <b-button
                    form="vehicle"
                    icon-left="upload"
                    type="is-primary"
                    native-type="submit"
                    >Add Vehicle</b-button
                  >
                  <b-button icon-left="reload" @click="resetVehicleForm"
                    >Reset Vehicle</b-button
                  >
                </div>
              </div>
            </div>
          </div>

          <!-- Added Vehicles Table -->
          <div v-if="vehicles" class="columns is-centered">
            <div class="column">
              <vehicles-table
                :vehicles="vehicles"
                delete-vehicles
                @vehicle-deleted="onVehicleDeleted"
              ></vehicles-table>
            </div>
          </div>
        </b-tab-item>
        <b-tab-item label="+ Add Vehicle Fleet">
          <add-vehicle-fleet-modal
            @add-fleet="onAddFleet"
          ></add-vehicle-fleet-modal>
        </b-tab-item>
      </b-tabs>

      <!-- Submit Policy -->
      <div class="columns is-centered">
        <div class="column is-half">
          <div class="buttons is-centered has-addons">
            <b-button
              form="form"
              icon-left="upload"
              type="is-primary"
              native-type="submit"
              @click="onSubmit"
              >Submit Policy</b-button
            >
            <b-button icon-left="reload" @click="resetForm"
              >Reset Form</b-button
            >
          </div>
        </div>
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapGetters } from 'vuex'
import { DateTime } from 'luxon'
import cloneDeep from 'lodash/cloneDeep'

import AddVehicleFleetModal from '~/components/modals/add-vehicle-fleet-modal.vue'

export default {
  name: 'App',
  // eslint-disable-next-line vue/no-unused-components
  components: { AddVehicleFleetModal },

  data: () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const minDate = new Date(today)

    return {
      minDate,
      clientName: '',
      colorName: '',
      addVehicle: false,
      addFleet: false,
      submitPolicy: false,
      csv: [],
      activeTab: 0,
    }
  },

  computed: {
    ...mapFields('policies', [
      'form',
      'form.clientType',
      'form.agencyID',
      'form.createdBy',
      'form.numOfQuarters',
      'form.startDate',
      'form.endDate',
      'form.currency',
      'form.clientID',
      'form.vehicles',
    ]),

    ...mapFields('vehicles', {
      storeVehicle: 'vehicle',
      make: 'vehicle.vehicleMake',
      model: 'vehicle.vehicleModelName',
      yearOfManufacture: 'vehicle.yearOfManufacture',
      regNumber: 'vehicle.vehicleRegNumber',
      engineNumber: 'vehicle.vehicleEngineNumber',
      chassisNumber: 'vehicle.vehicleChassisNumber',
      color: 'vehicle.vehicleColour',
      seatCapacity: 'vehicle.seatCapacity',
      cubicCapacity: 'vehicle.cubicCapacity',
      bodyType: 'vehicle.bodyType',
      productTypeID: 'vehicle.productTypeID',
      certificateNumber: 'vehicle.certificateNumber',
      vehicleStartDate: 'vehicle.startDate',
      vehicleEndDate: 'vehicle.endDate',
      vehicleNumOfQuarters: 'vehicle.numOfQuarters',
      insuredNames: 'vehicle.insuredNames',
    }),

    ...mapGetters('vehicles', [
      'bodyTypes',
      'productTypes',
      'vehiclesInActivePolicies',
    ]),

    ...mapGetters('clients', {
      clients: 'clientList',
      loadingClients: 'loading',
    }),

    ...mapGetters('helpers', ['currencies', 'quarters']),

    ...mapGetters('external-services', ['colors']),

    filteredClients() {
      return this.clients.filter(({ text }) =>
        text.toLowerCase().includes(this.clientName.toLowerCase())
      )
    },

    filteredColors() {
      return this.colors.filter((color) => {
        return color.toLowerCase().includes(this.colorName.toLowerCase())
      })
    },
  },

  watch: {
    numOfQuarters(quarter) {
      const startDate = DateTime.fromJSDate(this.startDate)

      this.calculateEndDate(quarter, startDate)
    },

    startDate(newDate) {
      const startDate = DateTime.fromJSDate(newDate)
      const quarter = this.numOfQuarters

      this.calculateEndDate(quarter, startDate)
    },

    vehicleNumOfQuarters(quarter) {
      const startDate = DateTime.fromJSDate(this.startDate)

      this.calculateVehicleEndDate(quarter, startDate)
    },

    vehicleStartDate(newDate) {
      const startDate = DateTime.fromJSDate(newDate)
      const quarter = this.numOfQuarters

      this.calculateVehicleEndDate(quarter, startDate)
    },
  },

  created() {
    if (typeof this.startDate === 'string')
      this.startDate = new Date(this.startDate)
    if (typeof this.endDate === 'string') this.endDate = new Date(this.endDate)
    if (typeof this.vehicleStartDate === 'string')
      this.vehicleStartDate = new Date(this.vehicleStartDate)
    if (typeof this.vehicleEndDate === 'string')
      this.vehicleEndDate = new Date(this.vehicleEndDate)

    this.loadClients()
    this.loadColors()
    this.clearForm()
    this.clearVehicleForm()
  },

  methods: {
    ...mapActions('helpers', ['setCurrency']),

    ...mapActions('clients', { loadClients: 'load' }),

    ...mapActions('policies', { loadPolicies: 'load' }),

    ...mapActions('external-services', ['loadColors', 'addColor']),

    ...mapActions('policies', ['createPolicy']),

    toggleVehicleAddition() {
      this.addVehicle = !this.addVehicle
    },

    clientSelected(option, event) {
      if (option) {
        this.vehicle.insuredNames = option.label
        this.insuredNames = option.label
      }
      if (!event) {
        this.vehicle.insuredNames = null
        this.insuredNames = null
      }
    },

    // Date calculations
    calculateEndDate(quarter, startDate) {
      const endOfStartDateQuarter = startDate.endOf('quarter')
      const endDate =
        quarter > 1
          ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
          : endOfStartDateQuarter

      this.endDate = endDate.endOf('day').toJSDate()
    },

    // Validation rules
    validRegNumber({ value }) {
      return !this.vehiclesInActivePolicies.some(
        (vehicle) =>
          vehicle.vehicleRegNumber.replace(/\s/g, '').toLowerCase() ===
          value.toLowerCase()
      )
    },

    validEngineNumber({ value }) {
      return !this.vehiclesInActivePolicies.some(
        (vehicle) =>
          vehicle.vehicleEngineNumber.toLowerCase() === value.toLowerCase()
      )
    },

    validChassisNumber({ value }) {
      return !this.vehiclesInActivePolicies.some(
        (vehicle) =>
          vehicle.vehicleChassisNumber.toLowerCase() === value.toLowerCase()
      )
    },

    // Vehicle date calculations
    calculateVehicleEndDate(quarter, startDate) {
      const endOfStartDateQuarter = startDate.endOf('quarter')
      const endDate =
        quarter > 1
          ? endOfStartDateQuarter.plus({ quarters: quarter - 1 })
          : endOfStartDateQuarter

      this.vehicleEndDate = endDate.endOf('day').toJSDate()
    },

    onVehicleSubmit(vehicle) {
      // alert(`Submitted: ${JSON.stringify(vehicle)}`)
      this.vehicles.push(vehicle)
      this.resetVehicleForm()
    },

    onAddFleet(vehicles) {
      vehicles.forEach((vehicle) => this.vehicles.push(vehicle))
    },

    clearVehicleForm() {
      this.storeVehicle = {
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
      }
      this.vehicle = cloneDeep(this.storeVehicle)
    },

    resetVehicleForm() {
      this.$formulate.reset('vehicle')
      this.clearVehicleForm()
    },

    onSubmit() {
      this.createPolicy()
      /* this.$buefy.toast.open({
        message: 'Policy added',
        duration: 4000,
        position: 'is-top',
        type: 'is-info',
      }) */
      // this.$parent.close()
    },
    close() {
      /* this.$buefy.toast.open({
        message: 'Policy addition cancelled...',
        duration: 5000,
        position: 'is-top',
        type: 'is-info',
      })
      this.$parent.close()
      */
    },

    onVehicleDeleted(index) {
      this.$buefy.toast.open({
        duration: 5000,
        message: `Vehicle removed!`,
        position: 'is-top',
        type: 'is-info',
      })
      this.vehicles.splice(index, 1)
      this.submitPolicy = !(this.vehicles.length === 0)
    },

    clearForm() {
      this.form = {
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
      }
    },

    resetForm() {
      this.$formulate.reset('policy')
      this.clearForm()
    },
  },
}
</script>
