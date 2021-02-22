<template>
  <div class="columns">
    <div class="px-6 mt-6 column">
      <b-tabs
        v-model="activeTab"
        vertical
        position="is-left"
        type="is-toggle"
        destroy-on-hide
      >
        <b-tab-item label="Pending Payments">
          <unreceipted-debits-table
            @create-policy="
              $router.push({ path: '/policies', query: { activeTab: 0 } })
            "
          ></unreceipted-debits-table>
        </b-tab-item>
        <b-tab-item label="Captured Receipts">
          <captured-receipts-table
            @create-policy="
              $router.push({ path: '/policies', query: { activeTab: 0 } })
            "
          ></captured-receipts-table>
        </b-tab-item>
        <!-- <b-tab-item label="Cancelled Receipts">
          <unreceipted-debits-table
            @create-policy="$router.push({ path: '/policies', query: { activeTab: 0 } })"
          ></unreceipted-debits-table>
        </b-tab-item> -->
      </b-tabs>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Receipts',

  data() {
    return {
      activeTab: 0,
    }
  },

  computed: {
    // ...mapGetters(),
  },

  // async created() {
  //   await this.load()
  // },

  methods: {
    // ...mapActions(),
  },
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: 1fr max-content;
}

.content-area {
  grid-column: 2/3;
}
</style>
