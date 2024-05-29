<script setup lang="ts">
  import type { PropType } from 'vue'

  import { Location } from '../types'

  const emit = defineEmits(['selectItem'])
  defineProps({
    selectedItem: {
      type: Object as PropType<Location | null>,
      default: null
    },
    items: {
      type: Array as PropType<Location[]>,
      default: () => []
    }
  })

  const selectItem = (item: Location) => {
    emit('selectItem', item)
  }
</script>

<template>
  <div class="stats-places">
    <div class="stats-places__wrapper">
      <div class="stats-places__list">
        <button
          v-for="item in items"
          @click="selectItem(item)"
          :class="[
            'stats-places__item',
            {
              _active: item.uuid === selectedItem?.uuid
            }
          ]"
        >
          <div class="stats-places__name">{{ item.name }}</div>
          <div class="stats-places__count">
            {{ item.amountMember }} <span>/ {{ item.procent.toString() !== 'NaN' ? Math.round(item.procent) : 0 }}%</span>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stats-places {
    width: 100%;
    height: 100%;
    // .stats-places__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      overflow: auto;

      &::-webkit-scrollbar {
        display: none;
      }
    }
    // .stats-places__list
    &__list {
    }
    // .stats-places__item
    &__item {
      display: flex;
      align-items: center;
      width: 100%;
      border: 1px solid var(--hover);
      padding: 10px 20px;
      text-align: left;
      background-color: transparent;
      border-radius: 10px;
      &:not(:first-child) {
        margin-top: 6px;
      }

      &:hover,
      &._active {
        background-color: var(--primary);
        color: var(--white);
      }
    }
    // .stats-places__name
    &__name {
      width: 0;
      flex: 1 1;
      font-size: 14px;
    }
    // .stats-places__count
    &__count {
      font-size: 16px;
      font-weight: 500;
    }
  }
</style>
