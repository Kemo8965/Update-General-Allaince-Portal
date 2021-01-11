<template>
  <b-navbar spaced shadow :mobile-burger="false">
    <template #brand>
      <nuxt-link :to="{ path: '/' }">
        <img
          class="img"
          src="@/assets/images/logo.png"
          alt="General Alliance Insurance"
        />
      </nuxt-link>
    </template>
    <template #start>
      <b-navbar-item
        class="is-size-4 is-hidden-mobile is-uppercase has-text-weight-bold"
        tag="div"
      >
        General Alliance Insurance
      </b-navbar-item>
    </template>

    <template v-if="loggedIn" #end>
      <b-navbar-item tag="div">
        <div class="buttons">
          <a class="button is-primary" @click="endSession">
            <strong>Log out</strong>
          </a>
          <nuxt-link
            class="button is-dark"
            :to="{ path: '/auth/login' }"
            tag="a"
          >
            <strong>Log in</strong>
          </nuxt-link>
        </div>
      </b-navbar-item>
    </template>
  </b-navbar>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },

  methods: {
    ...mapActions('auth', ['logOut']),

    async endSession() {
      await this.logOut()
      this.$router.push({ path: '/auth/login' })
    },
  },
}
</script>

<style scoped>
.img {
  display: block;
  height: 5rem;
  width: auto;
  margin: auto 0;
}
</style>
