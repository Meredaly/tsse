<script setup lang="ts">
  import { computed } from 'vue'
  import Icon from '@/UI/Icon'

  const props = defineProps({
    title: { type: String, default: null },
    icon: { type: String, default: null },
    rightIcon: { type: String, default: null },
    styles: { type: String, default: 'primary' },
    outline: { type: Boolean, default: false },
    block: { type: Boolean, default: false },
    soft: { type: Boolean, default: false }
  })
  const classes = computed(() => [
    'badges',
    `badges__${props.styles}`,
    {
      badges_outline: props.outline,
      badges_soft: props.soft
    }
  ])
</script>

<template>
  <div :class="classes">
    <span v-if="props.icon" class="badges__icon-left">
      <icon :name="props.icon" />
    </span>
    <span v-if="props.title" class="badges__content">
      {{ props.title }}
    </span>
    <span v-if="props.rightIcon" class="badges__icon-right">
      <icon :name="props.rightIcon" />
    </span>
  </div>
</template>

<style lang="scss" scoped>
  .badges {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5px 11px;
    border-radius: var(--border-radius);
    height: fit-content;
    border: 1px solid transparent;
    width: fit-content;
    // .badges__icon-left
    &__icon-left {
      display: flex;
      :deep(.icon) {
        display: flex;
        svg {
          width: 12px;
          height: 12px;
        }
      }
    }
    .badges__icon-left + .badges__content {
      padding-left: 3px;
    }
    // .badges__content
    &__content {
      font-weight: 500;
      font-size: 14px;
      line-height: 17px;
      color: inherit;
    }
    .badges__content + .badges__icon-right {
      padding-left: 3px;
    }
    // .badges__icon-right
    &__icon-right {
      display: flex;
      :deep(.icon) {
        display: flex;
        svg {
          width: 12px;
          height: 12px;
        }
      }
    }
    // .badges_block
    &_block {
      width: 100%;
    }
    // .badges__primary
    &__primary {
      background: var(--blue-600);
      border: 1px solid var(--blue-600);
      color: var(--white);
      &.badges_soft {
        background: var(--blue-100);
        color: var(--blue-600);
        border: 1px solid var(--blue-100);
      }
      &.badges_outline {
        background: var(--blue-100);
        color: var(--blue-600);
        border: 1px solid var(--blue-600);
      }
    }

    // .badges__secondary
    &__secondary {
      background: var(--gray-600);
      color: var(--white);
      border: 1px solid var(--gray-600);
      &.badges_soft {
        background: var(--gray-100);
        color: var(--gray-700);
        border: 1px solid var(--gray-100);
      }
      &.badges_outline {
        background: var(--gray-100);
        color: var(--gray-700);
        border: 1px solid var(--gray-700);
      }
    }

    // .badges__success
    &__success {
      background: var(--success);
      color: var(--white);
      border-color: var(--success);
      &.badges_soft {
        background: transparent;
        color: var(--success);
        border-color: transparent;
      }
      &.badges_outline {
        background: transparent;
        color: var(--success);
        border-color: var(--success);
      }
    }

    // .badges__danger
    &__danger {
      background: var(--danger);
      color: var(--white);
      border-color: var(--danger);
      &.badges_soft {
        background: transparent;
        color: var(--danger);
        border-color: transparent;
      }
      &.badges_outline {
        background: transparent;
        color: var(--danger);
        border-color: var(--danger);
      }
    }

    // .badges__warning
    &__warning {
      background: var(--warning);
      color: var(--white);
      border-color: var(--warning);
      &.badges_soft {
        background: transparent;
        color: var(--warning);
        border-color: transparent;
      }
      &.badges_outline {
        background: transparent;
        color: var(--warning);
        border-color: var(--warning);
      }
    }

    // .badges__info
    &__info {
      background: var(--info-600);
      color: var(--white);
      border: 1px solid var(--info-600);
      &.badges_soft {
        background: var(--info-100);
        color: var(--info-600);
        border: 1px solid var(--info-100);
      }
      &.badges_outline {
        background: var(--info-100);
        color: var(--info-600);
        border: 1px solid var(--info-600);
      }
    }

    // .badges__light
    &__light {
      background: var(--gray-100);
      color: var(--gray-700);
      border: 1px solid var(--gray-100);
      &.badges_soft {
        background: var(--gray-100);
        color: var(--gray-600);
        border: 1px solid var(--gray-100);
      }
      &.badges_outline {
        background: var(--gray-100);
        color: var(--gray-600);
        border: 1px solid var(--gray-600);
      }
    }
    // .badges__dark
    &__dark {
      background: var(--gray-800);
      color: var(--white);
      border: 1px solid var(--gray-800);
      &.badges_soft {
        background: var(--gray-600);
        color: var(--gray-800);
        border: 1px solid var(--gray-600);
      }
      &.badges_outline {
        background: var(--gray-600);
        color: var(--gray-800);
        border: 1px solid var(--gray-800);
      }
    }

    // .badges__purple
    &__purple {
      background: var(--purple-600);
      color: var(--white);
      border: 1px solid var(--purple-600);
      &.badges_soft {
        background: var(--purple-100);
        color: var(--purple-600);
        border: 1px solid var(--purple-100);
      }
      &.badges_outline {
        background: var(--purple-100);
        color: var(--purple-600);
        border: 1px solid var(--purple-600);
      }
    }
  }
</style>
