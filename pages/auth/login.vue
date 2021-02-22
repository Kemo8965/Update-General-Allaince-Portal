<template>
  <div class="grid is-full-height">
    <div class="card form-card">
      <FormulateForm
        #default="{ isLoading }"
        v-model="form"
        :class="['card-content']"
        @submit="onSubmit"
      >
        <p class="my-4">
          Enter your email address and password to access the portal.
        </p>

        <FormulateInput
          type="email"
          name="email"
          label="Email"
          validation="bail|required|email"
          data-has-icons-left
        >
          <template #suffix>
            <span class="icon is-left">
              <i class="mdi mdi-account"></i>
            </span>
          </template>
        </FormulateInput>

        <FormulateInput
          type="password"
          name="password"
          label="Password"
          validation="required"
          data-has-icons-left
        >
          <template #suffix>
            <span class="icon is-left">
              <i class="mdi mdi-key"></i>
            </span>
          </template>
        </FormulateInput>

        <b-button
          class="mt-4"
          expanded
          type="is-primary"
          tag="input"
          native-type="submit"
          value="Login"
        />
        <b-loading :active="isLoading" is-full-page></b-loading>
      </FormulateForm>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'LogIn',

  auth: 'guest',

  data() {
    return {
      form: {
        email: null,
        password: null,
      },
    }
  },

  computed: {},

  methods: {
    ...mapActions('auth', ['logIn']),

    async onSubmit() {
      try {
        const { data: response } = await this.$auth.loginWith('local', {
          data: this.form,
        })
        const user = response.data

        this.$auth.setUser(user)

        this.$buefy.toast.open({
          duration: 5000,
          message: 'Welcome back!',
          position: 'is-top',
          type: 'is-success',
        })

        this.onReset()

        this.$router.push({ path: '/' })
      } catch (error) {
        this.form.password = null
        const message = error.response
          ? error.response.data.message
          : error.message
        this.$buefy.toast.open({
          duration: 5000,
          message,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    onReset() {
      this.form.password = null
    },
  },
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-rows: 1fr minmax(min-content, auto) 1fr;
  grid-template-columns: 1fr minmax(min-content, auto) 1fr;
}

.form-card {
  grid-row: 2/3;
  grid-column: 2/3;
}
</style>
