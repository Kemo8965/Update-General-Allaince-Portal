<template>
  <div class="columns">
    <div class="px-6 mt-6 column"></div>
  </div>
</template>

<script>
// import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'Starter',

  data() {
    return {}
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
