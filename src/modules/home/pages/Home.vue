<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Datepicker from '@/UI/Datepicker'
  import StatsKindOfActivity from '../components/StatsKindOfActivity.vue'
  import StatsTypeOfProperty from '../components/StatsTypeOfProperty.vue'
  import StatsPlaces from '../components/StatsPlaces.vue'
  import StatsMembers from '../components/StatsMembers.vue'
  import MyButton from '@/UI/MyButton.vue'
  import { statsToExcel } from '../helpers/statsToExcel'

  import { Location, KindOfActivity, PaymentStatus, TypeOfProperty } from '../types'

  import { GET_COUNTERS, GET_TYPE_OF_PROPERTIES, GET_KIND_OF_ACTIVITIES, GET_PAYMENTS, GET_REGIONS } from '../api'

  const { t } = useI18n()

  const initialDate = ref<string>('')
  const finalDate = ref<string>('')

  const reverseDate = (date: string): string => {
    return date.split('-').reverse().join('-')
  }

  const kindOfActivities = ref<KindOfActivity[]>([])
  const getKindOfActivities = async (): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES({
        data: {
          initialDate: reverseDate(initialDate.value),
          finalDate: reverseDate(finalDate.value)
        }
      })
      kindOfActivities.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const typeOfProperties = ref<TypeOfProperty[]>([])
  const getTypeOfProperties = async (): Promise<void> => {
    try {
      const { data } = await GET_TYPE_OF_PROPERTIES({
        data: {
          initialDate: reverseDate(initialDate.value),
          finalDate: reverseDate(finalDate.value)
        }
      })
      typeOfProperties.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const countries = ref<Location[]>([])
  const getCountries = async (): Promise<void> => {
    try {
      const { data } = await GET_COUNTERS({
        data: {
          initialDate: reverseDate(initialDate.value),
          finalDate: reverseDate(finalDate.value)
        }
      })
      countries.value = data
    } catch (error) {
      console.error(error)
    }
  }
  const selectedCountry = ref<Location | null>(null)
  const selectCountry = (country: Location): void => {
    if (selectedCountry.value?.uuid === country.uuid) {
      selectedCountry.value = null
    } else {
      selectedCountry.value = country
    }
    getRegions()
  }

  const regions = ref<Location[]>([])
  const getRegions = async (): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
        data: {
          initialDate: reverseDate(initialDate.value),
          finalDate: reverseDate(finalDate.value),
          countryUuid: selectedCountry.value?.uuid || ''
        }
      })
      regions.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const paymentStatus = ref<PaymentStatus[]>([])
  const getPaymentStatus = async (): Promise<void> => {
    try {
      const { data } = await GET_PAYMENTS({
        data: {
          initialDate: reverseDate(initialDate.value),
          finalDate: reverseDate(finalDate.value)
        }
      })
      paymentStatus.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const getAll = () => {
    getKindOfActivities()
    getTypeOfProperties()
    getCountries()
    getRegions()
    getPaymentStatus()
  }
  getAll()

  const exportToExcel = () => {
    statsToExcel({
      kindOfActivities: kindOfActivities.value,
      typeOfProperties: typeOfProperties.value,
      countries: selectedCountry.value ? [selectedCountry.value] : countries.value,
      regions: regions.value,
      paymentStatus: paymentStatus.value
    })
  }
</script>

<template>
  <div class="stats">
    <div class="stats__wrapper">
      <div class="stats__kind-of-activity">
        <div class="stats__box">
          <div class="stats__box-head">
            <div class="stats__box-title">{{ t('stats.kindOfActivity') }}</div>
            <div class="stats__controllers">
              <datepicker @select-date="getAll" v-model="initialDate" width="130" />
              <span>-</span>
              <datepicker @select-date="getAll" v-model="finalDate" width="130" class="mr-10" />
              <my-button @click="exportToExcel" styles="primary" outline :title="t('export')" append-icon="arrowUpload" />
            </div>
          </div>
          <div class="stats__body">
            <stats-kind-of-activity :items="kindOfActivities" />
          </div>
        </div>
      </div>
      <div class="stats__type-of-property">
        <div class="stats__box">
          <div class="stats__box-head">
            <div class="stats__box-title">{{ t('stats.typeOfProperty') }}</div>
          </div>
          <div class="stats__body">
            <stats-type-of-property :items="typeOfProperties" />
          </div>
        </div>
      </div>
      <div class="stats__countries">
        <div class="stats__box">
          <div class="stats__box-head">
            <div class="stats__box-title">{{ t('stats.country') }}</div>
          </div>
          <div class="stats__body">
            <stats-places @select-item="selectCountry" :selected-item="selectedCountry" :items="countries" />
          </div>
        </div>
      </div>
      <div class="stats__regions">
        <div class="stats__box">
          <div class="stats__box-head">
            <div class="stats__box-title">{{ t('stats.region') }}</div>
          </div>
          <div class="stats__body">
            <stats-places :items="regions" />
          </div>
        </div>
      </div>
      <div class="stats__members">
        <div class="stats__box">
          <div class="stats__box-head">
            <div class="stats__box-title">{{ t('stats.TpptMembers') }}</div>
          </div>
          <div class="stats__body">
            <stats-members :items="paymentStatus" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .stats {
    width: 100%;
    height: 100%;
    overflow: auto;
    // .stats__wrapper
    &__wrapper {
      height: 100%;
      min-height: 800px;
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      grid-template-rows: 450px minmax(450px, 1fr);
      grid-gap: 20px;
    }

    // .stats__box
    &__box {
      background-color: var(--white);
      width: 100%;
      height: 100%;
      padding: 20px;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
    }
    // .stats__box-head
    &__box-head {
      padding-bottom: 10px;
      display: flex;
      justify-content: space-between;
    }
    // .stats__box-title
    &__box-title {
      font-size: 20px;
      font-weight: 500;
    }
    // .stats__controllers
    &__controllers {
      display: flex;
      gap: 10px;
      align-items: center;
    }
    // .stats__body
    &__body {
      height: 0;
      flex: 1 1;
    }

    // .stats__kind-of-activity
    &__kind-of-activity {
      grid-column-end: span 12;
    }
    // .stats__type-of-property
    &__type-of-property {
      grid-column-end: span 3;
    }
    // .stats__countries
    &__countries {
      grid-column-end: span 3;
    }
    // .stats__regions
    &__regions {
      grid-column-end: span 3;
    }
    // .stats__members
    &__members {
      grid-column-end: span 3;
    }
  }
</style>
