<script setup lang="ts">
  import Icon from '@/UI/Icon'

  const props = defineProps({
    width: {
      type: [String, Number],
      default: 600
    },
    title: {
      type: String,
      default: null
    }
  })
  const emit = defineEmits(['close'])
  const close = () => {
    emit('close')
  }
</script>

<template>
  <div class="pop-up">
    <div class="pop-up__wrapper __box" :style="`width: ${props.width}px`">
      <div class="pop-up__head">
        <h4 v-if="title" class="pop-up__title">{{ props.title }}</h4>
        <div class="pop-up__head-box">
          <slot name="head"></slot>
        </div>
        <button @click="close" class="pop-up__close">
          <icon name="dismiss" />
        </button>
      </div>
      <div class="pop-up__body">
        <slot></slot>
      </div>
      <div class="pop-up__bot">
        <slot name="bot"></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .pop-up {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    overflow: auto;
    padding: 20px;
    // .pop-up__wrapper
    &__wrapper {
      height: max-content;
      padding: 20px 40px;
      margin: 100px auto;
      max-width: 100%;
      position: relative;
      z-index: 1;
      background-color: var(--input-background);
    }
    // .pop-up__head
    &__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    // .pop-up__head-box
    &__head-box {
      flex: 1 1;
    }
    // .pop-up__close
    &__close {
      color: var(--black);
      &:deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .pop-up__title
    &__title {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: var(--black);
    }
    // .pop-up__body
    &__body {
      margin-top: 20px;
    }
    // .pop-up__bot
    &__bot {
      margin-top: 20px;
    }
  }
</style>
