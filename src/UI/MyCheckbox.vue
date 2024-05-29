<script setup lang="ts">
  import Icon from '@/UI/Icon'

  const emit = defineEmits(['updateStatus'])

  const props = defineProps({
    status: { type: Boolean, default: false },
    title: { type: String, default: null },
    radio: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false }
  })

  const updateStatus = () => {
    !props.disabled && emit('updateStatus', !props.status)
  }
</script>

<template>
  <div :class="['checkbox', { 'checkbox--disabled': disabled, 'checkbox--active': status }]">
    <div @click="updateStatus" class="checkbox__button">
      <div class="checkbox__icon">
        <icon :name="status ? 'checked' : 'unchecked'" />
      </div>
      <div v-if="title" class="checkbox__text">{{ title }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .checkbox {
    cursor: pointer;
    user-select: none;
    &--active {
      .checkbox__icon {
        color: var(--primary);
      }
    }
    &--disabled {
      cursor: not-allowed;
      pointer-events: all !important;
      .checkbox__icon,
      .checkbox__text {
        color: var(--caption);
      }
    }
    // .checkbox__button
    &__button {
      display: flex;
      align-items: center;
    }
    // .checkbox__icon
    &__icon {
      font-size: 24px;
      color: var(--text);
      .icon {
        display: flex;
      }
    }
    // .checkbox__text
    &__text {
      padding-left: 4px;
      color: var(--text);
    }
  }
</style>
