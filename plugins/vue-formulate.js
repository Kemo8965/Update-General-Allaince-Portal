import Vue from 'vue'
import VueFormulate from '@braid/vue-formulate'

// Custom components
import MyDatePicker from '~/components/formulate/DatePicker.vue'
import MyAutocomplete from '~/components/formulate/Autocomplete.vue'
import MyLabel from '~/components/formulate/Label.vue'

// register component with Vue
Vue.component('MyDatePicker', MyDatePicker)
Vue.component('MyAutocomplete', MyAutocomplete)
Vue.component('MyLabel', MyLabel)

Vue.use(VueFormulate, {
  // Validation name
  validationNameStrategy: ['validationName', 'label', 'name', 'type'],

  // Classes
  classes: {
    outer: 'field',

    element: ({ attrs, type }, classes) => {
      switch (type) {
        case 'select':
          classes.push('select')
          break

        default:
          classes.push('control')
          break
      }

      if ('data-is-expanded' in attrs) {
        classes.push('is-fullwidth')
      }

      if ('data-has-icons-left' in attrs) {
        classes.push('has-icons-left')
      } else if ('data-has-icons-right' in attrs) {
        classes.push('has-icons-right')
      }

      return classes
    },

    label: ({ type }, classes) => {
      switch (type) {
        case 'radio':
          classes.push('radio')
          break

        default:
          classes.push('label')
          break
      }
      return classes
    },

    help: 'help',

    error: 'help is-danger',

    input: ({ type, hasErrors, isValid }, classes) => {
      if (hasErrors) {
        classes.push('is-danger')
      } else if (isValid) {
        classes.push('is-success')
      }

      switch (type) {
        case 'select':
          classes.push('is-fullwidth')
          break

        case 'submit':
          classes.push('button')
          break

        case 'radio':
          break

        case 'datepicker':
          break

        case 'autocomplete':
          break

        default:
          classes.push('input')
          break
      }
      return classes
    },
  },

  // Define our custom slot component(s)
  slotComponents: {
    label: 'MyLabel',
  },
  // Define any props we want to pass to our slot component
  slotProps: {},

  // Library
  library: {
    datepicker: {
      classification: 'datepicker',
      component: 'MyDatePicker',
      slotProps: {
        component: ['minDate'],
      },
    },

    autocomplete: {
      classification: 'autocomplete',
      component: 'MyAutocomplete',
      slotProps: {
        component: ['valueField', 'field', 'icon'],
      },
    },
  },
})
