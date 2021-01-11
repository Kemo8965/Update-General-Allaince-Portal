<template>
  <div>
    <b-navbar spaced shadow :mobile-burger="false">
      <template v-slot:brand>
        <nuxt-link :to="{ path: '/' }">
          <img
            class="img"
            src="@/assets/images/logo.png"
            alt="General Alliance Insurance"
          />
        </nuxt-link>
      </template>
      <template v-slot:start>
        <b-navbar-item
          class="is-size-4 is-hidden-mobile is-uppercase has-text-weight-bold"
          tag="div"
        >
          General Alliance Insurance
        </b-navbar-item>
      </template>

      <template v-if="loggedIn" v-slot:end>
        <b-navbar-item tag="div">
          <div class="buttons">
            <!-- <b-button type="is-primary" @click="endSession">
              <strong>Log out</strong>
            </b-button> -->
            <b-button icon-left="menu" @click="sidebar = !sidebar"> </b-button>
          </div>
        </b-navbar-item>
      </template>
    </b-navbar>

    <b-sidebar v-model="sidebar" type="is-light" fullheight overlay>
      <b-menu class="menu" :activable="false">
        <b-menu-list
          v-for="({ label, items }, index) in menuList"
          :key="index"
          :label="label"
        >
          <b-menu-item
            v-for="({ icon, itemLabel }, key) in items"
            :key="key"
            :icon="icon"
            :label="itemLabel"
          ></b-menu-item>
        </b-menu-list>

        <!-- Account Actions -->
        <b-menu-list label="Account Actions">
          <b-menu-item
            icon="cog"
            label="Log out"
            @click="endSession"
          ></b-menu-item>
        </b-menu-list>
      </b-menu>
    </b-sidebar>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      sidebar: false,
      menuList: [
        {
          label: 'Dashboard',
          items: [{ icon: 'home', itemLabel: 'Dashboard', link: null }],
        },
        {
          label: 'Actions',
          items: [
            { icon: 'account', itemLabel: 'Manage Clients', link: null },
            {
              icon: 'text-box-plus-outline',
              itemLabel: 'Create Policy',
              link: null,
            },
          ],
        },
        {
          label: 'Finances',
          items: [{ icon: 'receipt', itemLabel: 'Receipts', link: null }],
        },
        {
          label: 'Reports',
          items: [{ icon: 'file-chart', itemLabel: 'Reports', link: null }],
        },
      ],
    }
  },

  computed: {
    ...mapGetters('auth', ['loggedIn']),
  },

  methods: {
    ...mapActions('auth', ['logOut']),

    async endSession() {
      this.sidebar = false

      await this.$buefy.dialog.confirm({
        title: 'Log out',
        message: 'Are you sure you want to <b>log out</b>?',
        cancelText: 'Cancel',
        confirmText: 'Yes',
        type: 'is-primary',
        hasIcon: true,
        onConfirm: async () => {
          await this.logOut()
          this.$buefy.toast.open({
            duration: 5000,
            message: 'Until next time, see you!',
            position: 'is-top',
            type: 'is-primary',
          })
          this.$router.push({ path: '/auth/login' })
        },
      })
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

.menu {
  padding: 2rem;
}
</style>
