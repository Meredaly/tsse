<script setup lang="ts">
  import { ref } from 'vue'
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import { TypeOfProperty } from '../types'

  defineProps({
    items: { type: Array as PropType<TypeOfProperty[]>, default: () => [] }
  })

  const { t } = useI18n()

  const typesOwnership = ref<any>({
    COMMERCIAL_SOCIETY: 'members.businessCompanies',
    PERSONAL_ENTERPRISE: 'members.privateEnterprices',
    FOREIGN_COMPANY: 'members.foreignCompany',
    STATE_ORGANIZATION: 'members.governmentOrganization',
    ENTREPRENEUR: 'members.entrepreneurs'
  })
</script>

<template>
  <div class="stats-type-of-property">
    <div class="stats-type-of-property__wrapper">
      <div v-for="item in items" class="stats-type-of-property__item">
        <div class="stats-type-of-property__count">{{ item.amountMember }}/{{ Math.round(item.procent) }}%</div>
        <div class="stats-type-of-property__name">{{ t(typesOwnership[item.name]) }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stats-type-of-property {
    width: 100%;
    height: 100%;
    // .stats-type-of-property__wrapper
    &__wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    // .stats-type-of-property__item
    &__item {
      display: flex;
      border: 1px solid var(--hover);
      background-color: var(--hover-light);
      padding: 10px;
      flex: 1 1;
      height: 0;
      border-radius: 4px;
      align-items: center;
    }
    // .stats-type-of-property__count
    &__count {
      font-size: 16px;
      font-weight: 600;
      width: 80px;
      min-width: 80px;
      background-color: var(--hover);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 10px;
      border-radius: 4px;
    }
    // .stats-type-of-property__name
    &__name {
      padding-left: 10px;
      font-size: 14px;
      line-height: 1.2;
    }
  }
</style>
