<script setup lang="ts">
  const props = defineProps({
    gap: {
      type: [String, Number],
      default: 20
    },
    rowGap: {
      type: [String, Number],
      default: null
    },
    columnGap: {
      type: [String, Number],
      default: null
    },
    count: {
      type: [Number, String],
      default: 12
    }
  })
</script>

<template>
  <div
    :class="[
      'row',
      `gap-${props.gap}`,
      {
        'column-gap-15': props.columnGap == '15',
        'column-gap-10': props.columnGap == '10',
        'row-gap-15': props.rowGap == '15',
        'row-gap-10': props.rowGap == '10'
      }
    ]"
    :style="`grid-template-columns: repeat(${props.count}, 1fr)`"
  >
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  .row {
    display: grid;
    width: 100%;
  }
  .gap-20 {
    grid-row-gap: 20px;
    grid-column-gap: 20px;
  }
  .row-gap-15 {
    grid-row-gap: 15px;
  }
  .row-gap-10 {
    grid-row-gap: 10px;
  }
  .column-gap-15 {
    grid-column-gap: 15px;
  }
  .column-gap-10 {
    grid-column-gap: 10px;
  }
</style>
