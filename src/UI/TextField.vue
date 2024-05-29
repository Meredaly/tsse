<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Icon from '@/UI/Icon'

  const emit = defineEmits(['click:prevent', 'click:append', 'update:modelValue', 'click:input', 'value', 'updateValue'])

  const props = defineProps({
    prependIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    placeholder: { type: String, default: '' },
    label: { type: String, default: null },
    message: { type: String, default: null },
    type: { type: String, default: 'text' },
    success: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: null },
    clickablePrevent: { type: Boolean, default: false },
    clickableAppend: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    width: { type: String, default: null },
    focused: { type: Boolean, default: false },
    value: { type: [String, Number], default: null },
    innerLabel: { type: String, default: null },
    prevLabel: { type: String, default: null },
    required: { type: Boolean, default: false },
    background: { type: Boolean, default: false }
  })

  const focused = ref(false)

  const classes = computed(() => [
    'input',
    {
      'input--background': props.background,
      'input--required': props.required,
      'input--prepend-icon': props.prependIcon,
      'input--append-icon': props.appendIcon,
      'input--success': props.success,
      'input--error': props.error,
      'input--disabled': props.disabled,
      'input--focused': focused.value || props.focused
    }
  ])
  const update = (newValue: number | string) => {
    if (props.type === 'number') newValue = Number(newValue)

    emit('update:modelValue', newValue)
    emit('value', newValue)
    emit('updateValue', newValue)
  }
</script>

<template>
  <div
    :class="classes"
    :style="{
      width: props.width ? `${props.width}px` : ''
    }"
  >
    <div v-if="props.label" class="input__label">{{ props.label }}</div>
    <div class="input__body">
      <div
        v-if="props.prependIcon"
        @click="$emit('click:prevent')"
        :class="['input__prepend-icon', { 'input__prepend-icon--clickable': props.clickablePrevent }]"
      >
        <Icon :name="props.prependIcon" />
      </div>
      <div class="input__input">
        <span v-if="props.prevLabel" class="input__inner-label input__inner-label_prev">{{ props.prevLabel }}</span>
        <input
          v-if="props.type !== 'button'"
          :type="props.type"
          :placeholder="props.placeholder"
          :value="props.modelValue || props.value"
          :disabled="props.disabled"
          @click="$emit('click:input')"
          @focus="focused = true"
          @blur="focused = false"
          @input="(event: Event) => update((event.target as HTMLInputElement).value)"
        />
        <button
          v-else
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          @click="$emit('click:input')"
          @focus="focused = true"
          @blur="focused = false"
        >
          <p>
            {{ props.modelValue || props.value }}
          </p>
        </button>
        <span v-if="props.type === 'button' && props.placeholder && !props.modelValue && !props.value" class="input_placeholder">{{
          props.placeholder
        }}</span>
        <span v-if="props.innerLabel" class="input__inner-label">{{ props.innerLabel }}</span>
      </div>
      <div
        v-if="props.appendIcon"
        @click="$emit('click:append')"
        :class="['input__append-icon', { 'input__append-icon--clickable': props.clickableAppend }]"
      >
        <Icon :name="props.appendIcon" />
      </div>
    </div>
    <div v-if="props.message" class="input__message">{{ props.message }}</div>
  </div>
</template>

<style lang="scss" scoped>
  .input {
    width: 100%;
    // .input__label
    &__label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--black);
      margin-bottom: 6px;
    }
    // .input__body
    &__body {
      width: 100%;
      background: var(--input-background);
      border: 1px solid var(--hover);
      position: relative;
      border-radius: var(--border-radius);
    }

    // .input__prepend-icon
    &__prepend-icon {
      position: absolute;
      top: 50%;
      left: 10px;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--caption);
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    // .input__append-icon
    &__append-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--caption);
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .input__input
    &__input {
      width: 100%;
      display: flex;
      align-items: center;
      input {
        width: 100%;
        padding: 10px 19px;
        background-color: transparent;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
        color: var(--text);
        flex: 1 1;
        text-align: left;
        &::placeholder,
        .placeholder {
          color: var(--caption);
        }
        &[type='submit'],
        &[type='button'] {
          cursor: pointer;
        }
        &[type='number'] {
          -moz-appearance: textfield;
        }
        &::-webkit-outer-spin-button,
        &::-webkit-inner-spin-button {
          -webkit-appearance: none;
        }
      }
      button {
        background-color: transparent;
        padding: 10px 19px;
        width: 100%;
        p {
          font-weight: 500;
          font-size: 14px;
          line-height: 20px;
          color: var(--text);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          text-align: left;
          height: 20px;
        }
      }
    }
    &_placeholder {
      font-size: 14px;
      line-height: 16px;
      color: var(--caption);
      user-select: none;
      pointer-events: none;
      padding: 10px 19px;
      position: absolute;
      left: 0;
    }

    // .input__message
    &__message {
      font-style: italic;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--caption);
      margin-top: 6px;
    }
    &__prepend-icon--clickable,
    &__append-icon--clickable {
      cursor: pointer;
      pointer-events: all;
      color: var(--black);
    }

    &--background {
      .input__body {
        background-color: var(--white);
      }
    }
    &--required {
      .input__label {
        &::after {
          content: '*';
          color: var(--danger);
        }
      }
    }
    &--prepend-icon {
      .input__input {
        input {
          padding-left: 36px;
        }
      }
    }

    &--append-icon {
      .input__input {
        input,
        button {
          padding-right: 36px;
        }
      }
    }
    &--focused {
      .input__body {
        border-color: var(--primary);
      }
    }

    &--success {
      .input__label {
      }
      .input__body {
        border-color: var(--success);
      }
      .input__prepend-icon {
      }
      .input__append-icon {
      }
      .input__message {
      }
    }

    &--error {
      animation: 0.2s invalid forwards;
      .input__label {
      }
      .input__body {
        border-color: var(--danger);
      }
      .input__prepend-icon {
      }
      .input__append-icon {
      }
      .input__message {
      }
    }

    &__inner-label {
      color: var(--primary);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      padding-right: 10px;
      &_prev {
        padding-right: 0;
        padding-left: 10px;
      }
    }

    &--disabled {
      .input__label {
      }
      .input__body {
      }
      .input__input {
        input,
        button {
          cursor: not-allowed;
          pointer-events: all !important;
        }
      }
      .input__prepend-icon {
      }
      .input__append-icon {
      }
      .input__message {
      }
    }
  }

  @keyframes invalid {
    0% {
      transform: translateX(0px);
    }
    25% {
      transform: translateX(5px);
    }
    50% {
      transform: translateX(0px);
    }
    75% {
      transform: translateX(-5px);
    }
    100% {
      transform: translateX(0px);
    }
  }
</style>
