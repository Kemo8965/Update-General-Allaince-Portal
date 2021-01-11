<template>
  <div class="is-full-height grid">
    <div class="card form-card">
      <form id="login-form" class="card-content" @submit.prevent="onSubmit">
        <p class="my-4">
          Enter your email address and password to access the portal.
        </p>
        <b-field label="Email" :type="emailState" :message="emailMessage">
          <b-input v-model="$v.form.email.$model" type="email"> </b-input>
        </b-field>

        <b-field
          label="Password"
          :type="passwordState"
          :message="passwordMessage"
        >
          <b-input
            v-model="$v.form.password.$model"
            type="password"
            password-reveal
          >
          </b-input>
        </b-field>

        <b-button
          class="mt-4"
          expanded
          type="is-primary"
          tag="input"
          native-type="submit"
          value="Login"
        />

        <b-loading v-model="loading" is-full-page></b-loading>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { email, required } from 'vuelidate/lib/validators'
// const password = helpers.regex(
//   'password',
//   /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
// )

export default {
  name: 'LogIn',

  middleware: 'guest',

  data() {
    return {
      form: {
        email: null,
        password: null,
      },
    }
  },

  validations: {
    form: {
      email: { email, required },
      password: { required },
    },
  },

  computed: {
    ...mapGetters('auth', ['loading']),

    validEmail() {
      return this.$v.form.email.$dirty ? !this.$v.form.email.$invalid : null
    },

    emailState() {
      if (this.$v.form.email.$dirty) {
        return this.validEmail ? 'is-success' : 'is-danger'
      }

      return null
    },

    emailMessage() {
      return this.$v.form.email.$dirty && !this.validEmail
        ? [
            { 'Please enter a valid email address': this.$v.form.email.email },
            { 'Your email address is required': this.$v.form.email.required },
          ]
        : null
    },

    validPassword() {
      return this.$v.form.password.$dirty
        ? !this.$v.form.password.$invalid
        : null
    },

    passwordState() {
      if (this.$v.form.password.$dirty) {
        return this.validPassword ? 'is-success' : 'is-danger'
      }

      return null
    },

    passwordMessage() {
      return this.$v.form.password.$dirty && !this.validPassword
        ? 'Your password is required'
        : null
    },
  },

  methods: {
    ...mapActions('auth', ['logIn']),

    async onSubmit() {
      try {
        this.$v.$touch()
        if (!this.$v.$invalid) {
          await this.logIn(this.form)

          this.$buefy.toast.open({
            duration: 5000,
            message: 'Welcome back!',
            position: 'is-top',
            type: 'is-success',
          })

          this.onReset()

          this.$router.push({ path: '/' })
        } else {
          throw new Error('Hmm... something went wrong!')
        }
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
      this.$v.form.password.$reset()
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
