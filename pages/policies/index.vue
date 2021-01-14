<template>
  <div class="columns">
    <div class="column mt-6 px-6">
      <b-tabs
        v-model="activeTab"
        vertical
        position="is-left"
        type="is-toggle"
        destroy-on-hide
      >
        <b-tab-item label="Create New Policy">
          <create-new-policy ref="createPolicy"></create-new-policy>
        </b-tab-item>
        <b-tab-item label="Pending Payments">
          <unreceipted-debits-table
            @create-policy="createPolicyTab"
          ></unreceipted-debits-table>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'ManagePolicies',

  middleware: 'auth',

  data() {
    return {
      activeTab: 1,
    }
  },

  computed: {
    // ...mapGetters(),
  },

  async created() {
    await this.load()
  },

  methods: {
    ...mapActions('policies', ['load']),

    createPolicyTab() {
      this.$refs.createPolicy.$mount().reloadComponent()
      this.activeTab = 0
    },
  },
}
</script>

<style scoped>
.grid {
  display: grid;

  /* grid-template-columns: 1fr max-content 1fr; */
  grid-template-columns: 1fr max-content 1fr;
}

.content-area {
  grid-column: 2/3;
}
</style>
