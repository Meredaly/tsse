<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Dropdown from '@/UI/Dropdown.vue'

  import { useValidators } from '@/helpers/validators'

  import { Country, Region } from '../types'

  import { GET_COUNTRIES } from '../api/country'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<Region | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required } = useValidators()

  const form = ref<Region>({
    uuid: '',
    name: ''
  })

  const searchText = ref<string>('')
  const countries = ref<Country[]>([])

  const getCountries = async (): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES({
        params: {
          page: 0,
          size: 25
        },
        data: {
          searchKey: searchText.value,
          sort: []
        }
      })

      countries.value = data
    } catch (error) {
      console.error(error)
    }
  }

  getCountries()

  const selectedCountry = ref<Country | null>(null)
  const selectCountry = (country: Country): void => {
    selectedCountry.value = country
    form.value.countryDTO = country
  }

  const close = (): void => {
    emit('close')
  }

  const error = ref<boolean>(false)
  const save = (): void => {
    if (checkValidation()) {
      emit('save', form.value)
    }
  }

  if (props.item) {
    form.value = JSON.parse(JSON.stringify(props.item))
    selectedCountry.value = props.item.countryDTO || null
  }

  const checkValidation = () => {
    if (required(form.value.countryDTO) && required(form.value.name)) {
      return true
    } else {
      error.value = false
      setTimeout(() => {
        error.value = true
      }, 0)
      return false
    }
  }
</script>

<template>
  <pop-up-body @close="close" :title="form.uuid ? t('localization.saveRegion') : t('localization.addRegion')" width="680">
    <my-row>
      <my-col cols="6">
        <dropdown
          @select-item="selectCountry"
          :selected-item="selectedCountry"
          :items="countries"
          :disabled="loading"
          :error="error && !selectedCountry"
          :label="t('localization.selectCountry')"
          background
          required
          searchable
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.name"
          :disabled="loading"
          :error="error && !form.name"
          :label="t('localization.enterRegion')"
          background
          required
        />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :disabled="loading" :title="t('cancel')" outline />
        <my-button @click="save" :loading="loading" :disabled="loading" :title="`${form.uuid ? `${t('save')}` : `${t('add')}`}`" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped></style>
