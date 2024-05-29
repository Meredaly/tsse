<script setup lang="ts">
  import { ref, computed } from 'vue'
  import Icon from '@/UI/Icon'

  const emit = defineEmits(['changeFile', 'openFile'])

  const props = defineProps({
    show: { type: String, default: null },
    placeholder: { type: String, default: '' },
    label: { type: String, default: null },
    message: { type: String, default: null },
    success: { type: Boolean, default: false },
    error: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: null },
    disabled: { type: Boolean, default: false },
    width: { type: String, default: null },
    value: { type: [String, Number], default: null },
    required: { type: Boolean, default: false },
    background: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }
  })

  const openFile = (): void => {
    emit('openFile')
  }

  const focused = ref(false)

  const classes = computed(() => [
    'file-uploader',
    'file-uploader--append-icon',
    {
      'file-uploader--background': props.background,
      'file-uploader--required': props.required,
      'file-uploader--prepend-icon': props.show,
      'file-uploader--success': props.success,
      'file-uploader--error': props.error,
      'file-uploader--disabled': props.disabled
    }
  ])
  const changeFiles = (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target && target.files?.length) emit('changeFile', target.files)
  }
</script>

<template>
  <div
    :class="classes"
    :style="{
      width: props.width ? `${props.width}px` : ''
    }"
  >
    <div v-if="props.label" class="file-uploader__label">{{ props.label }}</div>
    <div class="file-uploader__body" :style="`--progress: ${props.progress}%`">
      <button
        v-if="props.show"
        @click="openFile"
        class="file-uploader__prepend-icon file-uploader__prepend-icon--clickable"
      >
        <Icon name="eye" />
      </button>
      <label class="file-uploader__file">
        <div class="file-uploader__input">
          <input
            type="file"
            :placeholder="props.placeholder"
            :disabled="props.disabled"
            @focus="focused = true"
            @blur="focused = false"
            @change="changeFiles"
          />
          <span class="file-uploader__value">{{ props.modelValue || props.value }}</span>
          <span v-if="progress" class="file-uploader__progress">{{ progress }}%</span>
          <span v-if="!props.modelValue && !props.value" class="file-uploader_placeholder">{{
            props.placeholder
          }}</span>
        </div>
        <div class="file-uploader__append-icon">
          <Icon name="file" />
        </div>
      </label>
    </div>

    <div v-if="props.message" class="file-uploader__message" v-html="props.message"></div>
  </div>
</template>

<style lang="scss" scoped>
  .file-uploader {
    width: 100%;
    // .file-uploader__label
    &__label {
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--black);
      margin-bottom: 6px;
    }
    // .file-uploader__body
    &__body {
      width: 100%;
      cursor: pointer;
      background: var(--input-background);
      border: 1px solid var(--hover);
      position: relative;
      border-radius: var(--border-radius);
      display: flex;
      &::before {
        content: '';
        position: absolute;
        z-index: 0;
        width: var(--progress);
        background-color: var(--primary-500);
        height: 100%;
        left: 0;
        top: 0;
        border-radius: var(--border-radius);
        opacity: 0.5;
      }
    }
    // .file-uploader__file
    &__file {
      display: flex;
      cursor: pointer;
      width: 0;
      flex: 1 1;
    }

    // .file-uploader__prepend-icon
    &__prepend-icon {
      color: var(--dark);
      z-index: 2;
      margin: 10px 19px;
      margin-right: -9px;
      background-color: transparent;
      cursor: pointer;
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }

    // .file-uploader__append-icon
    &__append-icon {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      pointer-events: none;
      color: var(--caption);
      z-index: 1;
      :deep(svg) {
        width: 20px;
        height: 20px;
      }
    }
    // .file-uploader__progress
    &__progress {
      position: absolute;
      right: 40px;
      font-size: 14px;
      line-height: 16px;
      font-weight: 600;
      color: var(--dark);
      top: 50%;
      transform: translateY(-50%);
    }
    // .file-uploader__input
    &__input {
      width: 100%;
      display: flex;
      align-items: center;
      input {
        display: none;
      }
    }
    &__value {
      width: calc(100% - 75px);
      padding: 10px 0px 10px 19px;
      display: block;
      background-color: transparent;
      font-weight: 500;
      font-size: 14px;
      line-height: 20px;
      color: var(--text);
      text-align: left;
      height: 40px;
      z-index: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
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
      display: block;
    }

    // .file-uploader__message
    &__message {
      font-style: italic;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--caption);
      margin-top: 6px;
      white-space: pre-line;
    }
    &__prepend-icon-clickable,
    &__append-icon-clickable {
      cursor: pointer;
      pointer-events: all;
    }

    &--background {
      .file-uploader__body {
        background-color: var(--white);
      }
    }
    &--required {
      .file-uploader__label {
        &::after {
          content: '*';
          color: var(--danger);
        }
      }
    }
    &--prepend-icon {
      .file-uploader__input {
        input {
          padding-left: 36px;
        }
      }
    }

    &--append-icon {
      .file-uploader__input {
        input,
        button {
          padding-right: 36px;
        }
      }
    }
    &--focused {
      .file-uploader__body {
        border-color: var(--primary);
      }
    }

    &--success {
      .file-uploader__label {
      }
      .file-uploader__body {
        border-color: var(--success);
      }
      .file-uploader__prepend-icon {
      }
      .file-uploader__append-icon {
      }
      .file-uploader__message {
      }
    }

    &--error {
      animation: 0.2s invalid forwards;
      .file-uploader__label {
      }
      .file-uploader__body {
        border-color: var(--danger);
      }
      .file-uploader__prepend-icon {
      }
      .file-uploader__append-icon {
      }
      .file-uploader__message {
      }
    }

    &__append-icon--clickable {
      pointer-events: all;
      cursor: pointer;
    }

    &__inner-label {
      color: var(--primary);
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      padding-right: 10px;
    }

    &--disabled {
      .file-uploader__label {
      }
      .file-uploader__body {
      }
      .file-uploader__input {
        input,
        button {
          cursor: not-allowed;
          pointer-events: all !important;
        }
      }
      .file-uploader__prepend-icon {
      }
      .file-uploader__append-icon {
      }
      .file-uploader__message {
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
