<template>
  <b-field
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
    expanded
  >
    <b-autocomplete
      :ref="context.attributes['data-ref']"
      v-model="searchText"
      clearable
      open-on-focus
      :data="filteredOptions"
      :field="field"
      :icon="icon"
      :placeholder="context.attributes.placeholder"
      :disabled="context.attributes.disabled"
      @select="onSelect"
      @input="onInput"
    >
      <template
        v-if="context.attributes['data-additional-prompt']"
        v-slot:header
      >
        <a @click="addNewOption">
          <span>{{ context.attributes['data-additional-prompt'] }}</span>
        </a>
      </template>
      <template v-slot:empty> No results for {{ searchText }} </template>
    </b-autocomplete>
    <!-- <div v-if="context.attributes['data-additional-prompt']" class="control">
      <b-button
        type="is-primary"
        outlined
        @click="context.rootEmit('add-option')"
        >{{ context.attributes['data-additional-prompt'] }}</b-button
      >
    </div> -->
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

  data: () => ({ searchText: '' }),

  computed: {
    valueField() {
      return this.context.slotProps.component.valueField
    },

    field() {
      return this.context.slotProps.component.field
    },

    icon() {
      return this.context.slotProps.component.icon
    },

    filteredOptions() {
      return this.field
        ? this.context.options.filter((option) =>
            option[this.field]
              .toLowerCase()
              .includes(this.searchText.toLowerCase())
          )
        : this.context.options.filter((option) =>
            option.label.toLowerCase().includes(this.searchText.toLowerCase())
          )
    },
  },

  methods: {
    onSelect(option, event) {
      if (option) {
        this.context.model = this.valueField
          ? option.value[this.valueField]
          : option.value
      }
      if (!event) {
        this.context.model = null
      }
      this.context.rootEmit('selected', option, event)
    },

    onInput(value) {
      this.searchText = value
    },

    addNewOption() {
      this.$buefy.dialog.prompt({
        inputAttrs: {
          placeholder: this.context.attributes.placeholder,
          maxlength: 20,
          value: this.searchText,
        },
        confirmText: 'Add',

        onConfirm: (value) => {
          this.context.rootEmit('add-option', value)
          this.$refs[this.context.attributes['data-ref']].setSelected(value)
          this.context.model = value
        },
      })
    },
  },
}
</script>
