<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['close'])

  const { t } = useI18n()

  const close = () => {
    emit('close')
  }
</script>

<template>
  <div class="pop-up">
    <div class="pop-up__wrapper __box">
      <h4 class="pop-up__title">{{ t('canBeDeleted') }}</h4>
      <my-button @click="close" :title="t('understand')" />
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
    display: flex;
    align-items: center;
    justify-content: center;
    // .pop-up__wrapper
    &__wrapper {
      height: max-content;
      padding: 20px 40px;
      margin: 100px auto;
      max-width: 100%;
      width: 500px;
      position: relative;
      z-index: 1;
      background-color: var(--input-background);
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    // .pop-up__title
    &__title {
      font-weight: 600;
      font-size: 16px;
      line-height: 19px;
      color: var(--black);
      text-align: center;
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 20px;
    }
  }
</style>
