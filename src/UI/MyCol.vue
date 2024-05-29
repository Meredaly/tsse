<script setup lang="ts">
  const props = defineProps(['cols', 'rows'])
</script>
<template>
  <div :class="[`col-${props.cols}`, `${props.rows ? `row-${props.rows}` : ''}`]">
    <slot></slot>
  </div>
</template>

<style lang="scss" scoped>
  @for $i from 1 through 20 {
    .col-#{$i} {
      grid-column-start: span $i;
      align-self: self-end;
    }
    .row-#{$i} {
      grid-row-start: span $i;
    }
  }
</style>
