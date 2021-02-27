<template>
  <div class="block columns is-centered">
    <div class="mt-4 column is-four-fifths">
      <b-tabs v-model="activeTab" expanded position="is-left" type="is-toggle">
        <b-tab-item label="Create New Policy">
          <create-new-policy ref="createPolicy"></create-new-policy>
        </b-tab-item>
        <b-tab-item label="Pending Payments">
          <!-- <unreceipted-debits-table
            @create-policy="createPolicyTab"
          ></unreceipted-debits-table> -->
          <captured-receipts-table>
            <inactive-policies-table></inactive-policies-table>
          </captured-receipts-table>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import CreateNewPolicy from '~/components/forms/create-new-policy.vue'
import CapturedReceiptsTable from '~/components/tables/captured-receipts-table.vue'
import InactivePoliciesTable from '~/components/tables/inactive-policies-table.vue'

export default {
  name: 'ManagePolicies',
  components: { CreateNewPolicy, CapturedReceiptsTable, InactivePoliciesTable },

  data() {
    return {
      activeTab: 0,
    }
  },

  computed: {
    ...mapGetters('policies', ['loading']),
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
