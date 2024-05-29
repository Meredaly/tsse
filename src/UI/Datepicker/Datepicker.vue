<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'
  import Calendar from './Calendar.vue'
  import { useDropdown } from '@/composables/dropdown'

  const emit = defineEmits(['update:modelValue', 'value', 'selectDate'])

  const props = defineProps({
    placeholder: { type: String, default: '__.__.____' },
    label: { type: String, default: null },
    message: { type: String, default: null },
    success: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    modelValue: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    width: { type: String, default: null },
    value: { type: String, default: '' },
    required: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    top: { type: Boolean, default: false },
    right: { type: Boolean, default: false }
  })

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const classes = computed(() => [
    'date-picker',
    {
      'date-picker_background': props.background,
      'date-picker_focused': showDropdown.value,
      'date-picker_required': props.required,
      'date-picker_success': props.success,
      'date-picker_error': props.error,
      'date-picker_disabled': props.disabled
    }
  ])

  const selectDate = (date: string): void => {
    let newDate = date
      ? `${new Date(date).getFullYear().toString().padStart(4, '0')}-${(new Date(date).getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${new Date(date).getDate().toString().padStart(2, '0')}`
      : ''

    emit('update:modelValue', newDate)
    emit('value', newDate)
    emit('selectDate', newDate)
    closeDropdown()
  }

  const computedDate = computed(() => {
    let value = props.modelValue || props.value
    selectDate(value)
    return value
      ? `${new Date(value).getDate().toString().padStart(2, '0')}.${(new Date(value).getMonth() + 1)
          .toString()
          .padStart(2, '0')}.${new Date(value).getFullYear().toString().padStart(4, '0')}`
      : null
  })
</script>

<template>
  <div
    :class="classes"
    :style="{
      width: props.width ? `${props.width}px` : ''
    }"
    ref="dropdownBody"
  >
    <div class="date-picker__text-field">
      <div v-if="label" class="date-picker__label">{{ label }}</div>
      <button @click="showDropdown ? closeDropdown() : openDropdown()" class="date-picker__button">
        <div v-if="modelValue || value" class="date-picker__button-text">{{ computedDate }}</div>
        <div v-else class="date-picker__button-placeholder">{{ placeholder }}</div>
        <div class="date-picker__button-icon">
          <icon name="calendar" />
        </div>
      </button>
      <div v-if="props.message" class="date-picker__message">{{ props.message }}</div>
    </div>
    <div
      class="date-picker__calendar"
      :class="[
        'date-picker__calendar',
        {
          top: props.top,
          right: props.right
        }
      ]"
      ref="dropdownMenu"
    >
      <calendar :date="modelValue || value" @selectDate="selectDate" v-if="showDropdown && !disabled" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .date-picker {
    position: relative;
    width: 100%;
    // .date-picker__text-field
    &__text-field {
    }
    // .date-picker__label
    &__label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--black);
      margin-bottom: 6px;
    }
    // .date-picker__button
    &__button {
      width: 100%;
      background: var(--input-background);
      border: 1px solid var(--hover);
      position: relative;
      border-radius: var(--border-radius);
      text-align: left;
      display: flex;
      align-items: center;
    }
    // .date-picker__button-text
    &__button-text {
      width: 0;
      padding: 10px 19px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
      flex: 1 1;
      text-align: left;
    }
    // .date-picker__button-placeholder
    &__button-placeholder {
      width: 0;
      padding: 10px 19px;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--caption);
      user-select: none;
      pointer-events: none;
      flex: 1 1;
      text-align: left;
    }
    // .date-picker__button-icon
    &__button-icon {
      display: block;
      padding: 10px;
      pointer-events: none;
      color: var(--caption);
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .date-picker__calendar
    &__calendar {
      position: absolute;
      top: calc(100% + 10px);
      z-index: 3;
      &.top {
        top: auto;
        bottom: calc(100% - 15px);
      }
      &.right {
        right: 0;
      }
      :deep() {
        .calendar {
          box-shadow: var(--shadow);
        }
      }
    }
    // .date-picker__message
    &__message {
      font-style: italic;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--caption);
      margin-top: 6px;
    }

    &_background {
      .date-picker__button {
        background-color: var(--white);
      }
    }
    &_required {
      .date-picker__label {
        &::after {
          content: '*';
          color: var(--danger);
        }
      }
    }
    &_focused {
      .date-picker__button {
        border-color: var(--primary);
      }
    }
    &_error {
      animation: 0.2s invalid forwards;
      .date-picker__button {
        border-color: var(--danger);
      }
    }
  }

  @keyframes invalid {
    0% {
      z-index: 3;
      transform: translateX(0px);
    }
    25% {
      transform: translateX(5px);
      z-index: 3;
    }
    50% {
      transform: translateX(0px);
      z-index: 3;
    }
    75% {
      transform: translateX(-5px);
      z-index: 3;
    }
    100% {
      transform: translateX(0px);
      z-index: 3;
    }
  }
</style>
