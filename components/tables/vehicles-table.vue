<template>
  <div>
    <b-field grouped group-multiline>
      <b-select v-model="perPage">
        <option
          v-for="(option, index) in pageOptions"
          :key="index"
          :value="option"
        >
          {{ option }} entries
        </option>
      </b-select>
    </b-field>
    <b-table
      :data="tableData"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      mobile-cards
      default-sort="vehicleStartDate"
      aria-next-label="Next Page"
      aria-previous-label="Previous Page"
      aria-page-label="Page"
      aria-current-label="Current Page"
    >
      <b-table-column
        v-slot="props"
        field="productTypeID"
        label="Product Type"
        sortable
      >
        {{ mapProductTypes(props.row.productTypeID) }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="startDate"
        label="Start Date"
        sortable
      >
        {{ props.row.startDate | luxon }}
      </b-table-column>

      <b-table-column v-slot="props" field="endDate" label="End Date" sortable>
        {{ props.row.endDate | luxon }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="numOfQuarters"
        label="Insured Quarters"
        sortable
      >
        {{ props.row.numOfQuarters }}
      </b-table-column>

      <b-table-column v-slot="props" field="premium" label="Premium" sortable>
        {{ currencyValue(props.row.premium) }}
      </b-table-column>

      <b-table-column v-slot="props" label="Actions">
        <span class="buttons">
          <b-button
            v-if="viewVehicles"
            type="is-secondary-outline"
            icon-left="eye"
            @click="viewVehicle(props.row)"
            >View</b-button
          >
          <b-button
            v-if="viewCertificates"
            type="is-secondary-outline"
            icon-left="note-text"
            @click="viewCertificate(props.row)"
            >View Certificate</b-button
          >
          <b-button
            v-if="deleteVehicles"
            type="is-danger"
            icon-left="trash-can"
            @click="$emit('vehicle-deleted', props.index)"
          ></b-button>
        </span>
      </b-table-column>

      <template #empty>
        <h4 class="is-size-4 has-text-centered">
          No vehicles have been loaded &#x1F699;
        </h4>
      </template>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'VehiclesTable',

  props: {
    vehicles: {
      type: Array,
      required: true,
    },

    viewVehicles: {
      type: Boolean,
      default: false,
    },

    viewCertificates: {
      type: Boolean,
      default: false,
    },

    editVehicles: {
      type: Boolean,
      default: false,
    },

    deleteVehicles: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    isPaginated: true,
    currentPage: 1,
    perPage: 10,
    pageOptions: [10, 25, 50, 100],
    paginationPosition: 'bottom',
    defaultSortDirection: 'asc',
    sortIcon: 'arrow-up',
    sortIconSize: 'is-small',
  }),

  computed: {
    ...mapGetters('helpers', ['selectedCurrency']),

    ...mapGetters('vehicles', ['selectedVehicle', 'productTypes']),

    isEmpty() {
      return this.vehicles.length === 0
    },

    tableData() {
      return this.isEmpty ? [] : this.vehicles
    },
  },

  methods: {
    ...mapActions('vehicles', ['selectVehicle']),

    currencyValue(value) {
      switch (this.selectedCurrency) {
        case 'USD':
          return this.$options.filters.currency_usd(value)

        default:
          return this.$options.filters.currency(value)
      }
    },

    viewVehicle(vehicle) {
      this.selectVehicle(vehicle)
    },

    mapProductTypes(id) {
      return this.productTypes.find(({ value }) => value === id).label
    },
  },
}
</script>
