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
      default-sort="riskStartDate"
      aria-next-label="Next Page"
      aria-previous-label="Previous Page"
      aria-page-label="Page"
      aria-current-label="Current Page"
    >
      <b-table-column
        v-slot="props"
        field="productType"
        label="Product Type"
        sortable
      >
        {{ props.row.productType }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="riskStartDate"
        label="Start Date"
        sortable
      >
        {{ props.row.riskStartDate | luxon }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="riskEndDate"
        label="End Date"
        sortable
      >
        {{ props.row.riskEndDate | luxon }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="riskQuarter"
        label="Insured Quarters"
        sortable
      >
        {{ props.row.riskQuarter }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sumInsured"
        label="Sum Insured"
        sortable
      >
        {{ currencyValue(props.row.sumInsured) }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="netPremium"
        label="Premium"
        sortable
      >
        {{ currencyValue(props.row.netPremium) }}
      </b-table-column>

      <b-table-column v-slot="props" label="Actions">
        <span class="buttons">
          <b-button
            v-if="viewRisks"
            type="is-secondary-outline"
            icon-left="eye"
            @click="viewRisk(props)"
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
            v-if="deleteRisks"
            type="is-danger"
            icon-left="trash"
            @click="$emit('risk-deleted', props.index)"
          ></b-button>
        </span>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'RisksTable',

  props: {
    risks: {
      type: Array,
      required: true,
    },

    viewRisks: {
      type: Boolean,
      default: false,
    },

    viewCertificates: {
      type: Boolean,
      default: false,
    },

    editRisks: {
      type: Boolean,
      default: false,
    },

    deleteRisks: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      isPaginated: true,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      paginationPosition: 'bottom',
      defaultSortDirection: 'asc',
      sortIcon: 'arrow-up',
      sortIconSize: 'is-small',

      riskSelected: false,
      certificateSelected: false,
    }
  },

  computed: {
    ...mapGetters('helpers', ['selectedCurrency']),

    ...mapGetters('risks', ['selectedRisk']),

    isEmpty() {
      return this.risks.length === 0
    },

    tableData() {
      return this.isEmpty ? [] : this.risks
    },
  },

  methods: {
    ...mapActions('risks', ['selectRisk']),

    ...mapActions('policies', ['selectCertificate']),

    currencyValue(value) {
      switch (this.selectedCurrency) {
        case 'USD':
          return this.$options.filters.currency_usd(value)

        default:
          return this.$options.filters.currency(value)
      }
    },

    viewRisk(risk) {
      this.selectRisk(risk)
      this.riskSelected = true
      console.info(risk)
      // setTimeout(() => {
      //   this.$refs.risk.$mount()
      // }, 300)
      // setTimeout(() => this.$bvModal.show('risk-modal'), 500)
    },

    viewCertificate(certificate) {
      this.selectRisk(certificate)
      this.certificateSelected = true
      console.info(certificate)
      // setTimeout(() => {
      //   this.$refs.certificate.$mount()
      // }, 300)
      // setTimeout(() => this.$bvModal.show('risk-certificate'), 500)
    },
  },
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
}

.content-area {
  grid-column: 2/3;
}
</style>
