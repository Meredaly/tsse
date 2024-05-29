<script setup lang="ts">
  import type { PropType } from 'vue'
  import KindOfActivityBarChart from './KindOfActivityBarChart.vue'
  import KindOfActivityPieChart from './KindOfActivityPieChart.vue'

  import { KindOfActivity } from '../types'

  defineProps({
    items: {
      type: Array as PropType<KindOfActivity[]>,
      default: () => []
    }
  })
</script>

<template>
  <div class="stats-kind-of-activities">
    <div class="stats-kind-of-activities__wrapper">
      <div class="stats-kind-of-activities__bar">
        <kind-of-activity-bar-chart :items="items" />
      </div>
      <div class="stats-kind-of-activities__list">
        <kind-of-activity-pie-chart :items="items" />
        <!-- <button v-for="(item, index) in items" class="stats-kind-of-activities__item">
          <div class="stats-kind-of-activities__color" :style="`--color: ${COLORS[index]}`"></div>
          <div class="stats-kind-of-activities__name">{{ item.name }}</div>
        </button> -->
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .stats-kind-of-activities {
    width: 100%;
    height: 100%;

    // .stats-kind-of-activities__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      gap: 20px;
    }
    // .stats-kind-of-activities__bar
    &__bar {
      width: 0;
      flex: 1 1;
      height: 100%;
    }
    // .stats-kind-of-activities__list
    &__list {
      width: 320px;
      height: 100%;
      overflow: auto;
      &::-webkit-scrollbar {
        display: none;
      }
    }
    // .stats-kind-of-activities__item
    &__item {
      display: flex;
      background-color: transparent;
      margin-bottom: 10px;
      width: 100%;
      gap: 10px;
      padding: 10px;
      border-radius: 4px;
      background-color: #f8f8f8;
      align-items: center;
    }
    // .stats-kind-of-activities__color
    &__color {
      width: 30px;
      min-width: 30px;
      height: 30px;
      border-radius: 4px;
      background-color: var(--color);
    }
    // .stats-kind-of-activities__name
    &__name {
      text-align: left;
      font-size: 14px;
      line-height: 1.2;
    }
  }
</style>
