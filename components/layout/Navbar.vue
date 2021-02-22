<template>
  <div>
    <b-navbar centered spaced shadow>
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
        <b-navbar-item
          v-for="({ items }, index) in menuList"
          :key="index"
          class="is-hidden-desktop"
          tag="div"
        >
          <b-navbar-item
            v-for="({ itemLabel, link }, key) in items"
            :key="key"
            :to="link"
            tag="router-link"
            >{{ itemLabel }}</b-navbar-item
          >
        </b-navbar-item>
      </template>

      <template v-if="$auth.loggedIn" v-slot:end>
        <b-navbar-item tag="div" class="is-hidden-mobile">
          <b-button icon-left="menu" @click="sidebar = !sidebar"></b-button>
        </b-navbar-item>
      </template>
    </b-navbar>

    <b-sidebar
      v-model="sidebar"
      class="is-hidden-mobile"
      type="is-light"
      fullheight
      overlay
    >
      <b-menu class="menu" :activable="false">
        <b-menu-list
          v-for="({ label, items }, index) in menuList"
          :key="index"
          :label="label"
        >
          <b-menu-item
            v-for="({ icon, itemLabel, link }, key) in items"
            :key="key"
            :icon="icon"
            :label="itemLabel"
            @click="pushRoute(link)"
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
export default {
  data() {
    return {
      sidebar: false,
      menuList: [
        {
          label: 'Dashboard',
          items: [{ icon: 'home', itemLabel: 'Dashboard', link: '/' }],
        },
        {
          label: 'Actions',
          items: [
            { icon: 'account', itemLabel: 'Manage Clients', link: '/clients' },
            {
              icon: 'shield-car',
              itemLabel: 'Policies',
              link: '/policies',
            },
          ],
        },
        {
          label: 'Finances',
          items: [
            { icon: 'receipt', itemLabel: 'Receipts', link: '/receipts' },
          ],
        },
        {
          label: 'Reports',
          items: [
            { icon: 'file-chart', itemLabel: 'Reports', link: '/reports' },
          ],
        },
      ],
    }
  },

  computed: {},

  methods: {
    pushRoute(path) {
      this.sidebar = false
      this.$router.push({ path })
    },

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
          await this.$auth.logout()
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
