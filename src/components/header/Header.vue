<script setup lang="ts">
  import Icon from '@/UI/Icon'
  import HeaderLang from './HeaderLang.vue'
  import HeaderProfile from './HeaderProfile.vue'

  const emit = defineEmits(['toggleMenu'])

  const toggleMenu = () => {
    emit('toggleMenu')
  }
</script>

<template>
  <div class="header __box">
    <div class="header__wrapper">
      <div class="header__left">
        <button @click="toggleMenu" class="header__menu-button">
          <icon name="navigation" />
        </button>
      </div>
      <div class="header__right">
        <div class="header__lang">
          <header-lang />
        </div>
        <div class="header__profile">
          <header-profile />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header {
    width: 100%;
    height: 100%;

    // .header__wrapper
    &__wrapper {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 15px 24px;
    }

    // .header__left
    &__left {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }

    // .header__menu-button
    &__menu-button {
      color: var(--dark);
      background-color: transparent;
      padding: 8px;
      border-radius: var(--border-radius);
      transition: 0.2s;
      &:hover {
        background-color: var(--hover-light);
      }
    }

    // .header__right
    &__right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
    }
    // .header__lang
    &__lang {
    }
    // .header__profile
    &__profile {
    }
  }
</style>
