<template>
  <b-field
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    expanded
  >
    <b-datepicker
      v-model="model"
      icon="calendar-blank-outline"
      mobile-native
      :placeholder="context.attributes.placeholder"
      :min-date="minDate"
      :disabled="context.attributes.disabled"
      @input="onInput"
    ></b-datepicker>
  </b-field>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },

  computed: {
    model: {
      get() {
        return this.context.model ? this.context.model : null
      },

      set(newValue) {
        this.context.model = newValue
      },
    },

    minDate() {
      return this.context.slotProps.component.minDate || new Date('1970-01-01')
    },
  },

  methods: {
    onInput(value) {
      // this.context.model = value
      this.context.rootEmit('date-change', value)
    },
  },
}
</script>
