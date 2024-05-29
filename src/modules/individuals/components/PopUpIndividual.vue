<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Datepicker from '@/UI/Datepicker'
  import Dropdown from '@/UI/Dropdown.vue'
  import FileUploader from '@/UI/FileUploader.vue'
  import { fileUploader } from '@/composables/fileUploader'

  import { useValidators } from '@/helpers/validators'

  import { Individual, Country, Region } from '../types'

  import { GET_COUNTRIES } from '../api/country'
  import { GET_REGIONS } from '../api/region'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<Individual | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required } = useValidators()

  const form = ref<Individual>({
    uuid: '',
    name: '',
    surname: '',
    patronomicName: '',
    birthPlace: '',
    birthDate: '',
    fullAddressOfResidence: '',
    phoneNumber: '',
    countryUuid: '',
    regionUuid: '',
    fax: '',
    email: '',
    education: '',
    experience: '',
    knowledgeOfLanguages: '',
    imageUuid: '',
    copyPassportUuid: ''
  })

  const countries = ref<Country[]>([])

  const getCountries = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES({
        params: {
          searchKey: text
        }
      })

      countries.value = data
    } catch (error) {
      console.error(error)
    }
  }

  getCountries()

  const selectedCountry = ref<Country | null>(null)
  const selectCountry = async (country: Country): Promise<void> => {
    selectedCountry.value = country
    form.value.countryUuid = country.uuid

    selectedRegion.value = null
    form.value.regionUuid = ''

    await getRegions()
  }

  const regions = ref<Region[]>([])

  const getRegions = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
        params: { countryUuid: selectedCountry.value?.uuid, searchKey: text }
      })

      regions.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const selectedRegion = ref<Region | null>(null)
  const selectRegion = (region: Region): void => {
    selectedRegion.value = region

    form.value.regionUuid = region.uuid
  }

  const close = () => {
    emit('close')
  }

  const save = () => {
    form.value.imageUuid = individualApplication.value.uuid
    form.value.copyPassportUuid = passportCopy.value.uuid
    if (checkValidation()) {
      emit('save', form.value)
    }
  }
  const {
    fileData: individualApplication,
    uploadFile: uploadIndividualApplication,
    openFile: openIndividualApplication
  } = fileUploader()

  const { fileData: passportCopy, uploadFile: uploadPassportCopy, openFile: openPassportCopy } = fileUploader()

  const fileDataToForm = (data: any) => {
    return {
      uuid: data.uuid,
      name: data.name,
      path: data.path,
      progress: 0
    }
  }
  const getItem = async (): Promise<void> => {
    if (props.item) {
      props.item.image && (individualApplication.value = fileDataToForm(props.item.image))
      props.item.copyPassport && (passportCopy.value = fileDataToForm(props.item.copyPassport))

      form.value = {
        uuid: props.item.uuid,
        name: props.item.name,
        surname: props.item.surname,
        patronomicName: props.item.patronomicName,
        birthPlace: props.item.birthPlace,
        birthDate: props.item.birthDate || '',
        fullAddressOfResidence: props.item.fullAddressOfResidence,
        phoneNumber: props.item.phoneNumber,
        countryUuid: props.item.countryDTO?.uuid || '',
        regionUuid: props.item.regionDTO?.uuid || '',
        fax: props.item.fax,
        email: props.item.email,
        education: props.item.education,
        experience: props.item.experience,
        knowledgeOfLanguages: props.item.knowledgeOfLanguages,
        imageUuid: props.item.image?.uuid || '',
        copyPassportUuid: props.item.copyPassport?.uuid || ''
      }
      if (props.item.countryDTO) await selectCountry(props.item.countryDTO)
      if (props.item.regionDTO) selectRegion(props.item.regionDTO)
    }
  }
  getItem()

  const error = ref<boolean>(false)
  const checkValidation = () => {
    if (required(form.value.name) && required(form.value.surname)) {
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
  <pop-up-body
    @close="close"
    :title="form.uuid ? t('individuals.saveindividual') : t('individuals.individual')"
    width="1020"
  >
    <my-row>
      <my-col cols="4">
        <text-field
          v-model.trim="form.surname"
          :error="error && !form.surname"
          :label="t('individuals.surname')"
          :placeholder="t('individuals.surname')"
          :disabled="loading"
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.name"
          :disabled="loading"
          :error="error && !form.name"
          :label="t('individuals.name')"
          :placeholder="t('individuals.name')"
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.patronomicName"
          :label="t('individuals.fullName')"
          :placeholder="t('individuals.fullName')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4">
        <file-uploader
          @change-file="uploadIndividualApplication"
          @open-file="openIndividualApplication"
          :show="individualApplication.path"
          :value="individualApplication.name"
          :progress="individualApplication.progress"
          :disabled="loading"
          :label="t('individuals.photo')"
          :placeholder="t('individuals.photo')"
          background
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.birthPlace"
          :label="t('individuals.placeOfBirth')"
          :placeholder="t('individuals.address')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4">
        <datepicker
          v-model="form.birthDate"
          :label="t('individuals.dateOfBirth')"
          :placeholder="t('individuals.calendar')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4">
        <file-uploader
          @change-file="uploadPassportCopy"
          @open-file="openPassportCopy"
          :show="passportCopy.path"
          :value="passportCopy.name"
          :progress="passportCopy.progress"
          :disabled="loading"
          :placeholder="t('enterpreneur.selectFile')"
          :label="t('individuals.passport')"
          background
        />
      </my-col>
      <my-col cols="4">
        <dropdown
          @select-item="selectCountry"
          @search="getCountries"
          :selected-item="selectedCountry"
          :items="countries"
          :disabled="loading"
          :label="t('individuals.selectCountry')"
          :placeholder="t('individuals.country')"
          searchable
          background
        />
      </my-col>
      <my-col cols="4">
        <dropdown
          @select-item="selectRegion"
          @search="getRegions"
          :selected-item="selectedRegion"
          :items="regions"
          :disabled="loading"
          :label="t('individuals.selectRegion')"
          :placeholder="t('individuals.region')"
          searchable
          background
        />
      </my-col>
      <my-col cols="12">
        <text-field
          v-model.trim="form.fullAddressOfResidence"
          :label="t('individuals.fullResidentialAddress')"
          :placeholder="t('individuals.address')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.phoneNumber"
          :label="t('individuals.phone')"
          :placeholder="t('individuals.phone')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4" class="flex flex-y-start">
        <text-field
          v-model.trim="form.fax"
          :label="t('individuals.fax')"
          :placeholder="t('individuals.fax')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="4" class="flex flex-y-start">
        <text-field
          v-model.trim="form.email"
          :label="t('individuals.email')"
          :placeholder="t('individuals.email')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="12">
        <text-field
          v-model.trim="form.education"
          :label="t('individuals.education')"
          :placeholder="t('individuals.nameOfEducational')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.experience"
          :label="t('individuals.exprience')"
          :placeholder="t('individuals.previousPlaceOfWork')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.knowledgeOfLanguages"
          :label="t('individuals.languageSkills')"
          :placeholder="t('individuals.languageSkills')"
          :disabled="loading"
          background
        />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :disabled="loading" :title="t('cancel')" outline />
        <my-button @click="save" :loading="loading" :title="`${form.uuid ? `${t('save')}` : `${t('add')}`}`" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped></style>
