<template>
  <div>
    <form id="login-form">
      <b-field label="Email" type="is-danger" message="This email is invalid">
        <b-input type="email" value="john@" maxlength="30"> </b-input>
      </b-field>

      <b-field label="Password">
        <b-input type="password" value="iwantmytreasure" password-reveal>
        </b-input>
      </b-field>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'Home',

  middleware: 'auth',

  computed: {
    ...mapGetters('auth', ['loading']),
  },

  methods: {
    ...mapActions('auth', ['logIn']),
  },
}
</script>
