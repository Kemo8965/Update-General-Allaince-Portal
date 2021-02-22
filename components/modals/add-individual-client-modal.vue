<template>
  <div class="modal-card modal-wide">
    <header class="modal-card-head">
      <h3 class="modal-card-title">Add New Client</h3>
      <button type="button" class="delete" @click="close"></button>
    </header>
    <section class="modal-card-body has-background-white">
      <div class="columns">
        <!-- Title -->
        <div class="column is-narrow">
          <FormulateInput
            v-model="title"
            type="select"
            name="title"
            label="Title"
            placeholder="Title"
            :options="individualOptions.title"
          ></FormulateInput>
        </div>

        <!-- First name -->
        <div class="column">
          <FormulateInput
            v-model="firstName"
            type="text"
            name="firstName"
            label="First Name"
            placeholder="Brian"
            validation="required"
          ></FormulateInput>
        </div>

        <!-- Last name -->
        <div class="column">
          <FormulateInput
            v-model="lastName"
            type="text"
            name="lastName"
            label="Last Name"
            placeholder="Mwale"
            validation="required"
          ></FormulateInput>
        </div>
      </div>
      <div class="columns">
        <!-- Email -->
        <div class="column">
          <FormulateInput
            v-model="email"
            type="email"
            name="email"
            label="Email"
            placeholder="brian@example.com"
            validation="required|email"
          ></FormulateInput>
        </div>

        <!-- Phone Number -->
        <div class="column">
          <FormulateInput
            v-model="phoneNumber"
            type="text"
            name="phoneNumber"
            label="Phone Number"
            placeholder="260975000000"
            validation="required|number"
          ></FormulateInput>
        </div>
      </div>
      <div class="columns">
        <!-- Date of birth -->
        <div class="column">
          <b-field>
            <template v-slot:label> Date of Birth </template>
            <b-datepicker
              v-model="dateOfBirth"
              icon="calendar-blank-outline"
              mobile-native
              placeholder="-- Please select --"
            ></b-datepicker>
          </b-field>
        </div>

        <!-- Gender -->
        <div class="column">
          <FormulateInput
            v-model="gender"
            type="select"
            name="gender"
            label="Gender"
            :options="individualOptions.gender"
            placeholder="-- Please select --"
          ></FormulateInput>
        </div>

        <!-- Marital status -->
        <div class="column">
          <FormulateInput
            v-model="maritalStatus"
            type="select"
            name="maritalStatus"
            label="Marital Status"
            placeholder="-- Please select --"
            :options="individualOptions.maritalStatus"
          ></FormulateInput>
        </div>
      </div>

      <div class="columns">
        <div class="column is-one-third">
          <FormulateInput
            v-model="idType"
            type="select"
            name="idType"
            label="ID Type"
            placeholder="-- Please select --"
            :options="individualOptions.idType"
          ></FormulateInput>
        </div>

        <div class="column is-one-third">
          <FormulateInput
            v-model="idNumber"
            type="text"
            name="idNumber"
            label="ID Number"
            placeholder="123456/12/1"
            validation="required"
          ></FormulateInput>
        </div>
      </div>
      <div class="columns">
        <div class="column is-full">
          <FormulateInput
            v-model="residentialAddress"
            type="text"
            name="residentialAddress"
            label="Address"
            placeholder="19 Bright Street"
            validation="required"
          ></FormulateInput>
        </div>
      </div>
    </section>
    <footer class="modal-card-foot">
      <b-button label="Cancel" @click="close" />
      <b-button
        label="Submit"
        type="is-primary"
        icon-left="account"
        @click="onSubmit"
      />
    </footer>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AddIndividualClientModal',

  computed: {
    ...mapGetters('clients', ['individualOptions']),

    ...mapFields('clients', [
      'individualClientForm.firstName',
      'individualClientForm.lastName',
      'individualClientForm.title',
      'individualClientForm.dateOfBirth',
      'individualClientForm.gender',
      'individualClientForm.maritalStatus',
      'individualClientForm.idNumber',
      'individualClientForm.idType',
      'individualClientForm.phoneNumber',
      'individualClientForm.email',
      'individualClientForm.residentialAddress',
    ]),
  },

  mounted() {
    this.firstName = null
    this.lastName = null
    this.title = null
    this.dateOfBirth = null
    this.gender = null
    this.maritalStatus = null
    this.idNumber = null
    this.idType = null
    this.phoneNumber = null
    this.email = null
    this.residentialAddress = null
  },

  methods: {
    ...mapActions('clients', ['createIndividualClient']),

    async onSubmit() {
      await this.createIndividualClient()
      this.$buefy.toast.open({
        message: 'Client added',
        duration: 5000,
        position: 'is-top',
        type: 'is-info',
      })
      this.$parent.close()
    },

    close() {
      this.$buefy.toast.open({
        message: 'Client addition cancelled...',
        duration: 5000,
        position: 'is-top',
        type: 'is-info',
      })
      this.$parent.close()
    },
  },
}
</script>

<style scoped>
.modal-wide {
  width: auto;
}
</style>
