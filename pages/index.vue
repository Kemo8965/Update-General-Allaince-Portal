<template>
  <div class="container">
    <div class="columns mt-6 px-4">
      <div class="column">
        <h2 class="title is-size-2">Available Actions</h2>
        <div class="box">
          <b-field grouped group-multiline position="is-centered">
            <b-button
              v-for="({ name, icon, type, path }, index) in actions"
              :key="index"
              class="my-4 mx-2"
              :type="type"
              :icon-left="icon"
              size="is-large"
              @click="$router.push({ path })"
              >{{ name | startCase }}</b-button
            >
            <b-button
              class="my-4 mx-2"
              type="is-danger is-inverted"
              icon-right="logout"
              size="is-large"
              @click="endSession"
              >Log Out</b-button
            >
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
  name: 'Dashboard',

  middleware: 'auth',

  data() {
    return {
      actions: [
        {
          type: 'is-primary',
          icon: 'shield-car',
          name: 'manage-policies',
          path: '/policies',
        },
        {
          type: 'is-success',
          icon: 'account',
          name: 'manage-clients',
          path: '/clients',
        },
        {
          type: 'is-primary is-light',
          icon: 'receipt',
          name: 'manage-receipts',
          path: '/receipts',
        },
        {
          type: 'is-light',
          icon: 'file-chart',
          name: 'manage-reports',
          path: '/reports',
        },
      ],
    }
  },

  computed: {
    ...mapGetters('auth', ['loading']),

    ...mapState('auth', { user: 'currentUser' }),
  },

  methods: {
    ...mapActions('auth', ['logOut']),

    async endSession() {
      await this.$buefy.dialog.confirm({
        title: 'Log out',
        message: 'Are you sure you want to <b>log out</b>?',
        cancelText: 'Cancel',
        confirmText: 'Yes',
        type: 'is-warning',
        hasIcon: true,
        onConfirm: async () => {
          await this.logOut()
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Until next time, see you!',
            position: 'is-top',
            type: 'is-info',
          })
          this.$router.push({ path: '/auth/login' })
        },
      })
    },
  },
}
</script>
