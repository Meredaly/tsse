<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'

  const props = defineProps({
    title: { type: String, default: null },
    prevIcon: { type: String, default: null },
    appendIcon: { type: String, default: null },
    styles: { type: String, default: 'primary' },
    disabled: { type: Boolean, default: false },
    outline: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    small: { type: Boolean, default: false },
    large: { type: Boolean, default: false },
    soft: { type: Boolean, default: false },
    noBorder: { type: Boolean, default: false },
    onlyIcon: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  })

  const classes = computed(() => [
    'button',
    `button_${props.styles}`,
    {
      button_block: props.block,
      button_outline: props.outline,
      button_disabled: props.disabled,
      button_soft: props.soft,
      button_loading: props.loading,
      'button__only-icon': props.onlyIcon
    }
  ])
</script>

<template>
  <button :class="classes" :disabled="props.disabled">
    <span v-if="props.prevIcon" class="button__icon-left">
      <icon :name="props.prevIcon" />
    </span>
    <span v-if="props.title" class="button__content">
      {{ props.title }}
    </span>
    <span v-if="props.appendIcon" class="button__icon-right">
      <icon :name="props.appendIcon" />
    </span>
  </button>
</template>

<style lang="scss" scoped>
  .button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 20px;
    border-radius: var(--border-radius);
    height: fit-content;
    border: 1px solid transparent;
    position: relative;
    // .button__icon-left
    &__icon-left {
      :deep(.icon) {
        width: 20px;
        height: 20px;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    .button__icon-left + .button__content {
      padding-left: 6px;
    }
    // .button__content
    &__content {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
      color: inherit;
    }
    .button__content + .button__icon-right {
      padding-left: 6px;
    }
    // .button__icon-right
    &__icon-right {
      :deep(.icon) {
        width: 20px;
        height: 20px;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    &.button__only-icon {
      padding: 8px;
      :deep(.icon) {
        width: 24px;
        height: 24px;
        svg {
          width: 100%;
          height: 100%;
        }
      }
    }
    // .button_block
    &_block {
      width: 100%;
    }
    // .button_loading
    &_loading {
      &::after {
        content: '';
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 3px solid var(--white);
        border-left-color: transparent;
        position: absolute;
        top: 50%;
        left: 50%;
        animation: rotate 0.8s linear infinite;
        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      }
      .button__icon-left,
      .button__icon-right,
      .button__content {
        opacity: 0;
        visibility: hidden;
      }
    }
    // .button__primary
    &_primary {
      background: var(--primary);
      color: var(--white);
      border-color: var(--primary);

      &.button_soft {
        background: transparent;
        color: var(--primary);
        border-color: transparent;
      }
      &.button_outline {
        background: transparent;
        color: var(--primary);
        border-color: var(--primary);
        &:hover {
          background-color: var(--primary-500);
          color: var(--primary);
        }
      }
      &:hover {
        border-color: var(--primary);
        color: var(--white);
        background: var(--primary);
      }
    }

    // .button__secondary
    &_secondary {
      background: var(--background);
      color: var(--caption);
      border-color: var(--background);

      &.button_soft {
        background: transparent;
        border-color: transparent;
        color: var(--caption);
      }
      &.button_outline {
        background: transparent;
        color: var(--caption);
        border-color: var(--caption);
      }
      &:hover {
        background: var(--background);
        color: var(--caption);
        border-color: var(--background);
      }
    }

    // .button__danger
    &_danger {
      background: var(--danger);
      color: var(--white);
      border-color: var(--danger);

      &.button_soft {
        background: transparent;
        color: var(--danger);
        border-color: transparent;
      }
      &.button_outline {
        background: transparent;
        color: var(--danger);
        border-color: var(--danger);
      }
      &.button_no-border {
        background: transparent;
        color: var(--danger);
        border: transparent;
      }
      &:hover {
        background: var(--danger);
        color: var(--white);
        border-color: var(--danger);
      }
    }

    // .button__warning
    &_warning {
      background: var(--warning-600);
      color: var(--white);
      border-color: var(--warning-600);

      &.button_soft {
        background: var(--warning-100);
        color: var(--warning-600);
      }
      &.button_outline {
        background: transparent;
        color: var(--warning-600);
        border-color: var(--warning-600);
      }
      &.button_no-border {
        background: transparent;
        color: var(--warning-600);
        border-color: transparent;
      }
      &:hover {
        color: var(--white);
        border-color: var(--warning-700);
        background: var(--warning-700);
      }
    }
  }
</style>
