<template>
  <div>
    <form id="pay-debit" @submit.prevent="onSubmit">
      <div class="modal-card">
        <header class="modal-card-head">
          <h3 class="modal-card-title">Capture Receipt</h3>
          <button type="button" class="delete" @click="close"></button>
        </header>
        <section class="modal-card-body has-background-white">
          <b-field grouped>
            <!-- Received From -->
            <b-field expanded :type="receivedFromState">
              <template v-slot:label>
                Received From <span class="has-text-danger">*</span>
              </template>
              <b-input
                v-model="$v.form.receivedFrom.$model"
                placeholder="Name Surname"
              ></b-input>
            </b-field>

            <!-- Amount -->
            <b-field :type="amountState">
              <template v-slot:label>
                Amount <span class="has-text-danger">*</span>
              </template>
              <p class="control">
                <span class="button is-static"> ZMW </span>
              </p>
              <b-input
                v-model="$v.form.amount.$model"
                expanded
                type="number"
                step=".01"
                :disabled="validAmount"
              ></b-input>
            </b-field>
          </b-field>

          <b-field grouped>
            <!-- Receipt Type -->
            <b-field expanded :type="receiptTypeState">
              <template v-slot:label>
                Receipt Type <span class="has-text-danger">*</span>
              </template>
              <b-select
                v-model="$v.form.receiptType.$model"
                placeholder="-- Please select a receipt type --"
              >
                <option
                  v-for="(type, index) in receiptTypes"
                  :key="index"
                  :value="type"
                >
                  {{ type }}
                </option>
              </b-select>
            </b-field>

            <!-- Payment Method -->
            <b-field expanded :type="paymentMethodState">
              <template v-slot:label>
                Payment Method <span class="has-text-danger">*</span>
              </template>
              <b-select
                v-model="$v.form.paymentMethod.$model"
                placeholder="-- Please select a payment method --"
              >
                <option
                  v-for="(method, index) in paymentMethods"
                  :key="index"
                  :value="method"
                >
                  {{ method }}
                </option>
              </b-select>
            </b-field>
          </b-field>

          <b-field grouped>
            <!-- Narration -->
            <b-field expanded :type="narrationState">
              <template v-slot:label>
                Narration <span class="has-text-danger">*</span>
              </template>
              <b-input
                v-model="$v.form.narration.$model"
                max-length="200"
                type="textarea"
                placeholder="Enter narration..."
              ></b-input>
            </b-field>

            <!-- Cheque Number -->
            <b-field
              v-if="form.paymentMethod === 'Cheque'"
              expanded
              :type="chequeNumberState"
            >
              <template v-slot:label>
                Cheque Number <span class="has-text-danger">*</span>
              </template>
              <b-input v-model="$v.form.chequeNumber.$model"></b-input>
            </b-field>
          </b-field>
        </section>
        <footer class="modal-card-foot">
          <b-button label="Cancel" @click="close" />
          <b-button
            label="Capture"
            type="is-primary"
            icon-left="cash"
            native-type="submit"
          />
        </footer>
      </div>
    </form>
    <b-loading v-model="loading" :is-full-page="isFullPage"></b-loading>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import {
  alphaNum,
  and,
  helpers,
  decimal,
  maxValue,
  numeric,
  or,
  required,
  requiredIf,
} from 'vuelidate/lib/validators'
const name = helpers.regex('name', /^[a-zA-z]{3,}/i)

export default {
  name: 'PayDebitModal',

  middleware: 'auth',

  data() {
    return {
      isFullPage: true,
      form: {
        receivedFrom: null,
        amount: null,
        receiptType: null,
        paymentMethod: null,
        chequeNumber: null,
        narration: null,
      },
      paymentToast: null,
      rtsaToast: null,
    }
  },

  computed: {
    ...mapGetters('policies', {
      policy: 'selectedPolicy',
      policyLoading: 'loading',
    }),

    ...mapGetters('receipts', {
      receiptLoading: 'loading',
      receiptTypes: 'receiptTypes',
      paymentMethods: 'paymentMethods',
    }),

    loading() {
      return this.policyLoading || this.receiptLoading
    },

    validReceivedFrom() {
      return this.$v.form.receivedFrom.$dirty
        ? !this.$v.form.receivedFrom.$invalid
        : null
    },

    receivedFromState() {
      return this.$v.form.receivedFrom.$dirty
        ? this.validReceivedFrom
          ? 'is-success'
          : 'is-danger'
        : null
    },

    validAmount() {
      return !this.$v.form.amount.$invalid
    },

    amountState() {
      return this.$v.form.amount.$dirty
        ? this.validAmount
          ? 'is-success'
          : 'is-danger'
        : null
    },

    validReceiptType() {
      return this.$v.form.receiptType.$dirty
        ? !this.$v.form.receiptType.$invalid
        : null
    },

    receiptTypeState() {
      return this.$v.form.receiptType.$dirty
        ? this.validReceiptType
          ? 'is-success'
          : 'is-danger'
        : null
    },

    validPaymentMethod() {
      return this.$v.form.paymentMethod.$dirty
        ? !this.$v.form.paymentMethod.$invalid
        : null
    },

    paymentMethodState() {
      return this.$v.form.paymentMethod.$dirty
        ? this.validPaymentMethod
          ? 'is-success'
          : 'is-danger'
        : null
    },

    optionalChequeNumber() {
      return this.form.paymentMethod === 'Cheque'
    },

    validChequeNumber() {
      return this.$v.form.chequeNumber.$dirty &&
        this.form.paymentMethod === 'Cheque'
        ? !this.$v.form.chequeNumber.$invalid
        : null
    },

    chequeNumberState() {
      return this.$v.form.chequeNumber.$dirty
        ? this.validChequeNumber
          ? 'is-success'
          : 'is-danger'
        : null
    },

    validNarration() {
      return this.$v.form.narration.$dirty
        ? !this.$v.form.narration.$invalid
        : null
    },

    narrationState() {
      return this.$v.form.narration.$dirty
        ? this.validNarration
          ? 'is-success'
          : 'is-danger'
        : null
    },
  },

  validations() {
    return {
      form: {
        receivedFrom: { required, name },
        amount: {
          required,
          number: or(decimal, numeric),
          maxValue: maxValue(this.policy.netPremium),
        },
        receiptType: { required, name },
        paymentMethod: { required, name },
        chequeNumber: {
          chequeNumber: and(
            alphaNum,
            requiredIf(() => this.optionalChequeNumber)
          ),
        },
        narration: { required, name },
      },
    }
  },

  watch: {
    policy(newPolicy, oldPolicy) {
      this.form.amount = newPolicy.netPremium
    },
  },

  mounted() {
    this.form.amount = this.policy.netPremium
  },

  methods: {
    ...mapActions('receipts', ['makePayment']),

    ...mapActions('policies', ['activatePolicy', 'postPolicyToRtsa']),

    close() {
      this.$buefy.toast.open({
        message: 'Payment cancelled...',
        duration: 5000,
        position: 'is-top',
        type: 'is-info',
      })
      this.$parent.close()
    },

    async onSubmit() {
      try {
        this.$v.form.$touch()

        if (this.$v.form.$error)
          throw new Error(`Please check for errors in the form`)

        this.paymentToast = this.$buefy.toast.open({
          indefinite: true,
          message: 'Sending payment...',
          position: 'is-top',
          type: 'is-info',
        })

        await this.makePayment(this.form)

        if (this.paymentToast) {
          this.paymentToast.close()
          this.paymentToast = null
        }

        this.rtsaToast = this.$buefy.toast.open({
          indefinite: true,
          message: `Sending details to RTSA...`,
          position: 'is-top',
          type: 'is-info',
        })

        await this.activatePolicy()

        await this.postPolicyToRtsa()

        if (this.rtsaToast) {
          this.rtsaToast.close()
          this.rtsaToast = null
        }

        this.$buefy.notification.open({
          duration: 5000,
          message: `Payment and submission to RTSA successful!`,
          position: 'is-top',
          type: 'is-success',
          hasIcon: true,
        })

        this.onReset()
        this.$router.push({ path: '/receipts' })
        this.close()
      } catch (error) {
        const msg = error.response ? error.response.data.message : error.message
        this.$buefy.toast.open({
          message: `Error: ${msg}`,
          duration: 5000,
          position: 'is-top',
          type: 'is-danger',
        })
      }
    },

    onReset() {
      this.form = {
        receivedFrom: null,
        amount: null,
        receiptType: null,
        paymentMethod: null,
        chequeNumber: null,
        narration: null,
      }
      this.$v.form.$reset()
    },
  },
}
</script>
