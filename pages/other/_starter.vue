<template>
  <div class="grid">
    <div class="content-area"></div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Starter',

  middleware: 'auth',

  data() {
    return {}
  },

  computed: {
    ...mapGetters(),
  },

  // async created() {
  //   await this.load()
  // },

  methods: {
    ...mapActions(),
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
