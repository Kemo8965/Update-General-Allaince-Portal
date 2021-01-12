<template>
  <div class="grid">
    <div class="content-area mt-4 p-4">
      <b-tabs v-model="activeTab" position="is-left" type="is-toggle">
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
  name: 'Clients',

  middleware: 'auth',

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
