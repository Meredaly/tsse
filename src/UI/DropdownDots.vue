<script setup lang="ts">
  import type { PropType } from 'vue'
  import Icon from '@/UI/Icon'
  import { useDropdown } from '@/composables/dropdown'

  interface Item {
    id: string | number
    name: string
    icon?: string
  }

  const { dropdownBody, dropdownMenu, showDropdown, closeDropdown } = useDropdown()

  defineProps({
    items: { type: Array as PropType<Item[]>, default: () => [] }
  })

  const emit = defineEmits(['selectItem'])

  const selectItem = (item: Item): void => {
    closeDropdown()
    emit('selectItem', item)
  }

  const openDropdown = (): void => {
    showDropdown.value = true
  }
</script>

<template>
  <div :class="['dropdown-dots', { _active: showDropdown }]" ref="dropdownBody">
    <div class="dropdown-dots__box">
      <div @click="showDropdown ? closeDropdown() : openDropdown()" class="dropdown-dots__button">
        <span class="dropdown-dots__button-icon">
          <icon name="moreVertical" />
        </span>
      </div>
      <div v-if="showDropdown" ref="dropdownMenu" class="dropdown-dots__menu">
        <div class="dropdown-dots__list __box">
          <button v-for="menuItem in items" :key="menuItem.id" @click="selectItem(menuItem)" class="dropdown-dots__item">
            <div v-if="menuItem.icon" class="dropdown-dots__item-icon">
              <icon :name="menuItem.icon" />
            </div>
            <div class="dropdown-dots__item-text">{{ menuItem.name }}</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .dropdown-dots {
    display: -webkit-inline-box;
    width: max-content;
    position: relative;
    &._active {
      .dropdown-dots__menu {
        visibility: visible;
        opacity: 1;
        top: calc(100% + 5px);
      }
    }
    // .dropdown-dots__label
    &__label {
      font-weight: 500;
      font-size: 12px;
      line-height: 14px;
      color: var(--gray-800);
      padding-bottom: 4px;
    }
    // .dropdown-dots__box
    &__box {
    }
    // .dropdown-dots__button
    &__button {
      border-radius: var(--button-radius);
      background-color: transparent;
      position: relative;
      display: flex;
      padding: 6px;
      cursor: pointer;
      user-select: none;
      width: max-content;
    }
    // .dropdown-dots__button-icon
    &__button-icon {
      color: var(--text);
      font-size: 20px;
      display: flex;
      :deep() {
        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
    // .dropdown-dots__menu
    &__menu {
      position: absolute;
      right: 0;
      z-index: 1;
      transition: 0.2s;
      top: calc(100% + 15px);
      visibility: hidden;
      opacity: 0;
    }
    // .dropdown-dots__list
    &__list {
      padding: 2px;
      box-shadow: var(--shadow);
      overflow: hidden;
    }
    // .dropdown-dots__item
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
      &:deep(.icon) {
        margin-right: 10px;
        margin-left: -10px;
        svg {
          width: 20px;
          height: 20px;
        }
      }
      &:hover {
        background-color: var(--hover-light);
      }
    }
    // .dropdown-dots__item-text
    &__item-text {
      font-weight: 400;
      font-size: 14px;
      line-height: 20px;
    }
  }
</style>
