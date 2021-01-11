<template>
  <div>
    <p class="has-text-weight-bold">The url is: {{ url }}</p>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'Dashboard',

  middleware: 'auth',

  data() {
    return {
      url: null,
    }
  },

  computed: {
    ...mapGetters('auth', ['loading']),

    ...mapState('auth', { user: 'currentUser' }),
  },

  mounted() {
    this.url = process.env.NUXT_ENV_AUTH_URL
  },

  methods: {
    ...mapActions('auth', ['logIn']),
  },
}
</script>
