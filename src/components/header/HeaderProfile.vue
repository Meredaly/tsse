<script setup lang="ts">
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  import { useAuth } from '@/store/auth'

  const auth = useAuth()

  const { dropdownBody, dropdownMenu, showDropdown, openDropdown, closeDropdown } = useDropdown()

  const user = auth.getUser

  const toggleDropdown = () => {
    showDropdown.value ? closeDropdown() : openDropdown()
  }

  const logOut = () => {
    closeDropdown()
    auth.logOut()
  }
</script>

<template>
  <div :class="['header-profile', { _active: showDropdown }]" ref="dropdownBody">
    <div @click="toggleDropdown" class="header-profile__button">
      <div class="header-profile__avatar">
        <span>{{ user.name[0].toUpperCase() }}{{ user.surname[0]?.toUpperCase() }}</span>
      </div>
    </div>
    <div class="header-profile__menu" ref="dropdownMenu">
      <div class="header-profile__list __box">
        <button @click="logOut" class="header-profile__item">
          <icon name="signOut" />
          <p>Выйти</p>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .header-profile {
    position: relative;
    &._active {
      .header-profile__menu {
        visibility: visible;
        opacity: 1;
        top: calc(100% + 5px);
      }
    }
    // .header-profile__button
    &__button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      background-color: var(--hover);
      cursor: pointer;
      user-select: none;
    }
    // .header-profile__avatar
    &__avatar {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
      }
      span {
        color: var(--caption);
        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
      }
    }
    // .header-profile__menu
    &__menu {
      position: absolute;
      right: 0;
      z-index: 1;
      transition: 0.2s;
      top: calc(100% + 15px);
      visibility: hidden;
      opacity: 0;
    }
    // .header-profile__list
    &__list {
      padding: 2px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    // .header-profile__item
    &__item {
      display: block;
      width: 100%;
      padding: 10px 24px;
      border-radius: var(--box-radius);
      background-color: transparent;
      font-size: 14px;
      display: flex;
      align-items: center;
      color: var(--dark);
      .icon {
        font-size: 20px;
        display: flex;
      }
      p {
        margin-left: 10px;
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }
      &:hover {
        background-color: var(--hover-light);
      }
    }
  }
</style>
