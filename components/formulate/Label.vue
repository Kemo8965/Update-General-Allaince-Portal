<template>
  <label :for="context.id" :class="context.classes.label">
    {{ context.label }}
    <span v-if="required" class="has-text-danger">*</span>
  </label>
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
    required() {
      return this.context.rules.some(({ ruleName }) => ruleName === 'required')
    },
  },
}
</script>
