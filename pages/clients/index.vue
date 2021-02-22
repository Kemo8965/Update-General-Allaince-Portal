<template>
  <div class="columns">
    <div class="px-6 mt-6 column">
      <b-tabs v-model="activeTab" vertical position="is-left" type="is-toggle">
        <b-tab-item label="Individual Clients">
          <individual-clients-table></individual-clients-table>
        </b-tab-item>
        <b-tab-item label="Corporate Clients">
          <corporate-clients-table></corporate-clients-table>
        </b-tab-item>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ManageClients',

  data() {
    return {
      activeTab: 0,
    }
  },

  computed: {
    ...mapGetters('clients', ['loading']),
  },

  async created() {
    await this.load()
  },

  methods: {
    ...mapActions('clients', ['load']),
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
