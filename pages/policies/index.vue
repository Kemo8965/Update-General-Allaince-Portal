<template>
  <div class="columns">
    <div class="column mt-6">
      <b-tabs v-model="activeTab" vertical position="is-left" type="is-toggle">
        <b-tab-item label="Create New Policy">
          <create-new-policy></create-new-policy>
        </b-tab-item>
        <b-tab-item label="Pending Payments">
          <quotations-table></quotations-table>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ManagePolicies',

  middleware: 'auth',

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

  /* grid-template-columns: 1fr max-content 1fr; */
  grid-template-columns: 1fr max-content 1fr;
}

.content-area {
  grid-column: 2/3;
}
</style>
