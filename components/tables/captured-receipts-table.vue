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

      <b-button class="mr-3" icon-left="refresh" @click="load"
        >Refresh</b-button
      >
      <b-button
        icon-left="plus"
        type="is-primary"
        @click="$emit('create-policy')"
        >Create New Policy</b-button
      >
    </b-field>
    <b-table
      :data="tableData"
      :loading="loading"
      :paginated="isPaginated"
      :per-page="perPage"
      :current-page.sync="currentPage"
      :pagination-position="paginationPosition"
      :default-sort-direction="defaultSortDirection"
      mobile-cards
      default-sort="receipt_number"
      aria-next-label="Next Page"
      aria-previous-label="Previous Page"
      aria-page-label="Page"
      aria-current-label="Current Page"
    >
      <b-table-column
        v-slot="props"
        field="receipt_number"
        label="Receipt Number"
        sortable
        searchable
      >
        {{ props.row.receipt_number }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="on_behalf_of"
        label="On Behalf Of"
        sortable
        searchable
      >
        {{ props.row.on_behalf_of }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="sum_in_digits"
        label="Amount"
        sortable
        searchable
      >
        {{ currencyValue(props.row, 'sum_in_digits') }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="receipt_type"
        label="Receipt Type"
        sortable
        searchable
      >
        {{ props.row.receipt_type }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="date_received"
        label="Date Received"
        sortable
      >
        {{ props.row.date_received | luxon }}
      </b-table-column>

      <b-table-column v-slot="props" label="Options">
        <span class="buttons">
          <b-button
            type="is-primary"
            icon-left="eye"
            @click="viewReceipt(props.row)"
            >View</b-button
          >
          <b-button
            type="is-danger is-inverted"
            icon-left="trash-can"
            @click="cancelReceipt(props.row)"
            >Cancel</b-button
          >
        </span>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'UnreceiptedDebitsTable',

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
    }
  },

  computed: {
    ...mapGetters('receipts', {
      loading: 'loading',
      receipts: 'receipts',
    }),

    isEmpty() {
      return this.receipts.length === 0
    },

    tableData() {
      return this.isEmpty ? [] : this.receipts
    },
  },

  async created() {
    await this.load()
  },

  methods: {
    ...mapActions('receipts', ['load', 'selectReceipt']),

    currencyValue(receipt, field) {
      switch (receipt.currency) {
        case 'USD':
          return this.$options.filters.currency_usd(receipt[field])

        default:
          return this.$options.filters.currency(receipt[field])
      }
    },

    // captureReceipt(receipt) {
    //   this.selectPolicy(receipt)
    //   setTimeout(() => {
    //     this.$buefy.modal.open({
    //       parent: this,
    //       component: PayDebitModal,
    //       hasModalCard: true,
    //       trapFocus: true,
    //       canCancel: ['x'],
    //       destroyOnHide: true,
    //       customClass: '',
    //       onCancel: () => {
    //         this.$buefy.toast.open({
    //           message: `Payment cancelled!`,
    //           duration: 5000,
    //           position: 'is-top',
    //           type: 'is-info',
    //         })
    //       },
    //     })
    //   }, 300)
    // },

    viewReceipt(receipt) {
      this.selectReceipt(receipt)
    },

    cancelReceipt(receipt) {
      this.selectReceipt(receipt)
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
