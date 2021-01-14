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
      default-sort="policyNumber"
      aria-next-label="Next Page"
      aria-previous-label="Previous Page"
      aria-page-label="Page"
      aria-current-label="Current Page"
    >
      <b-table-column
        v-slot="props"
        field="policyNumber"
        label="Policy ID"
        sortable
      >
        {{ props.row.policyNumber }}
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
        field="nameOfInsured"
        label="Client"
        sortable
        searchable
      >
        {{ props.row.nameOfInsured }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="netPremium"
        label="Net Premium"
        sortable
        searchable
      >
        {{ currencyValue(props.row, 'netPremium') }}
      </b-table-column>

      <b-table-column
        v-slot="props"
        field="status"
        label="Policy Status"
        sortable
      >
        <span
          :class="[
            'tag',
            {
              'is-success': props.row.status === 'Active',
            },
            {
              'is-warning': props.row.status === 'Inactive',
            },
          ]"
          >{{ props.row.status }}</span
        >
      </b-table-column>

      <b-table-column v-slot="props" field="status" label="Status" sortable>
        <span class="tag is-warning">{{ props.row.receiptStatus }}</span>
      </b-table-column>

      <b-table-column v-slot="props" label="Options">
        <span class="buttons">
          <!-- <b-button type="is-secondary-outline" icon-left="eye">View</b-button> -->
          <b-button
            type="is-secondary-outline"
            icon-left="cash-multiple"
            @click="captureReceipt(props.row)"
            >Capture Receipt</b-button
          >
        </span>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import PayDebitModal from '@/components/modals/pay-debit-modal'

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
    ...mapGetters('policies', {
      loading: 'loading',
      policies: 'unreceiptedPolicies',
    }),

    isEmpty() {
      return this.policies.length === 0
    },

    tableData() {
      return this.isEmpty ? [] : this.policies
    },
  },

  async created() {
    await this.load()
    this.selectPolicy(this.policies[0])
  },

  methods: {
    ...mapActions('policies', ['load', 'selectPolicy']),

    currencyValue(policy, field) {
      switch (policy.currency) {
        case 'USD':
          return this.$options.filters.currency_usd(policy[field])

        default:
          return this.$options.filters.currency(policy[field])
      }
    },

    captureReceipt(policy) {
      this.selectPolicy(policy)
      setTimeout(() => {
        this.$buefy.modal.open({
          parent: this,
          component: PayDebitModal,
          hasModalCard: true,
          trapFocus: true,
          canCancel: ['x'],
          destroyOnHide: true,
          customClass: '',
          onCancel: () => {
            this.$buefy.toast.open({
              message: `Payment cancelled!`,
              duration: 5000,
              position: 'is-top',
              type: 'is-info',
            })
          },
        })
      }, 300)
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
