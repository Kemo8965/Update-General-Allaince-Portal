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
      <b-button icon-left="plus" type="is-primary">Create New Policy</b-button>
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
      default-sort="quoteNumber"
      aria-next-label="Next Page"
      aria-previous-label="Previous Page"
      aria-page-label="Page"
      aria-current-label="Current Page"
    >
      <b-table-column
        v-slot="props"
        field="quoteNumber"
        label="Policy ID"
        sortable
      >
        {{ props.row.quoteNumber }}
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
        field="client"
        label="Client Name"
        sortable
        searchable
      >
        {{ props.row.client }}
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
              'is-success': props.row.status === 'Approved',
            },
            {
              'is-warning': props.row.status === 'Draft',
            },
          ]"
          >{{ props.row.status }}</span
        >
      </b-table-column>

      <b-table-column label="Options">
        <span class="buttons">
          <b-button type="is-secondary-outline" icon-left="eye">View</b-button>
          <b-button type="is-secondary-outline" icon-left="cash-multiple"
            >Capture Receipt</b-button
          >
        </span>
      </b-table-column>
    </b-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'QuotationsTable',

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
    ...mapGetters('quotations', {
      loading: 'loading',
      quotes: 'quotations',
    }),

    isEmpty() {
      return this.quotes.length === 0
    },

    tableData() {
      return this.isEmpty ? [] : this.quotes
    },
  },

  async created() {
    await this.load()
  },

  methods: {
    ...mapActions('quotations', ['load']),
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
