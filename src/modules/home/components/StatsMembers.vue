<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PropType } from 'vue'
  import MembersPieChart from './MembersPieChart.vue'

  import { PaymentStatus } from '../types'

  const { t } = useI18n()

  const props = defineProps({
    items: {
      type: Array as PropType<PaymentStatus[]>,
      default: () => []
    }
  })

  const paid = ref<number>(0)
  const notPaid = ref<number>(0)

  watchEffect(() => {
    props.items.forEach((item: PaymentStatus) => {
      if (item.name === 'PAID') {
        paid.value = item.amountMember
      }
      if (item.name === 'PAYMENT_TIME_HAS_EXPIRED') {
        notPaid.value = item.amountMember
      }
    })
  })
</script>

<template>
  <div class="stats-members">
    <div class="stats-members__wrapper">
      <div class="stats-members__stats">
        <members-pie-chart :paid="paid" :not-paid="notPaid" />
      </div>
      <div class="stats-members__counts">
        <div class="stats-members__count stats-members__count_big">
          <div class="stats-members__count-title">{{ t('stats.all') }}</div>
          <div class="stats-members__count-number">{{ paid + notPaid }}</div>
        </div>
        <div class="stats-members__count stats-members__count_success">
          <div class="stats-members__count-title">{{ t('stats.paid') }}</div>
          <div class="stats-members__count-number">{{ paid }}</div>
        </div>
        <div class="stats-members__count stats-members__count_warning">
          <div class="stats-members__count-title">{{ t('stats.noPaid') }}</div>
          <div class="stats-members__count-number">{{ notPaid }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stats-members {
    width: 100%;
    height: 100%;
    // .stats-members__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    // .stats-members__stats
    &__stats {
      flex: 1 1;
      height: 0;
      padding-bottom: 10px;
      border-bottom: 1px solid var(--hover);
    }
    // .stats-members__counts
    &__counts {
      padding-top: 10px;
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
    // .stats-members__count
    &__count {
      padding: 10px;
      border-radius: 4px;
      border: 1px solid var(--hover);
      background-color: var(--hover-light);
      // .stats-members__count_big
      &_big {
        grid-column-start: span 2;
      }
      // .stats-members__count_warning
      &_warning {
        background-color: var(--warning);
      }
      // .stats-members__count_success
      &_success {
        background-color: var(--success);
      }
    }
    // .stats-members__count-title
    &__count-title {
      font-size: 14px;
      font-weight: 300;
    }
    // .stats-members__count-number
    &__count-number {
      font-size: 24px;
      font-weight: 600;
      padding-top: 4px;
    }
  }
</style>
