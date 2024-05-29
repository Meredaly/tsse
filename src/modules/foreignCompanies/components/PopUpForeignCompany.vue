<script setup lang="ts">
  import { ref, computed } from 'vue'
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Dropdown from '@/UI/Dropdown.vue'
  import FileUploader from '@/UI/FileUploader.vue'
  import PopUpSelect from '@/components/PopUpSelect.vue'
  import PopUpIndividual from '@/modules/individuals/components/PopUpIndividual.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'

  import { fileUploader } from '@/composables/fileUploader'
  import { useValidators } from '@/helpers/validators'

  import { Item, ForeignCompany, ForeignCompanyData } from '../types'
  import { Individual } from '@/modules/individuals/types'

  import { GET_KIND_OF_ACTIVITIES, GET_COUNTRIES, GET_REGIONS, GET_INDIVIDUALS } from '../api/other'
  import { ADD_INDIVIDUAL } from '@/modules/individuals/api'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<ForeignCompany | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required, site } = useValidators()

  const form = ref<ForeignCompanyData>({
    name: '',
    phoneNumber: '',
    email: '',
    fullAddress: '',
    fax: '',
    webSite: '',
    typeWork: '',
    countryUuid: '',
    regionUuid: '',
    directorUuid: '',
    typeActivityUuids: '',
    founderUuids: '',
    membershipApplicationUuid: '',
    certificateOfForeignEconomicRelationsUuid: '',
    extractFromUsreoUuid: '',
    certificateOfStateRegistrationUuid: '',
    charterOfTheEnterpriseUuid: '',
    paymentOfTheEntranceMembershipFeeUuid: '',
    logoUuid: ''
  })
  const kindOfActivities = ref<Item[]>([])
  const getKindOfActivities = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES({
        params: {
          searchKey: text
        }
      })
      kindOfActivities.value = data || []
    } catch (error) {
      console.error(error)
    }
  }
  getKindOfActivities()

  const selectedKindOfActivities = ref<Item[]>([])
  const selectKindOfActivities = (selectedItems: Item[]): void => {
    selectedKindOfActivities.value = selectedItems

    closePopUpSelectKindOfActivity()
  }
  const kindOfActivitiesName = computed((): string => {
    form.value.typeActivityUuids =
      selectedKindOfActivities.value.map((kindOfActivity: Item): string => kindOfActivity.uuid).join(', ') || ''
    return selectedKindOfActivities.value.map((kindOfActivity: Item): string => kindOfActivity.name).join(', ')
  })

  const showPopUpSelectKindOfActivity = ref<boolean>(false)
  const openPopUpSelectKindOfActivity = () => {
    showPopUpSelectKindOfActivity.value = true
  }
  const closePopUpSelectKindOfActivity = () => {
    showPopUpSelectKindOfActivity.value = false
  }

  const countries = ref<Item[]>([])
  const getCountries = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES({
        params: {
          searchKey: text
        }
      })
      countries.value = data || []
    } catch (error) {
      console.error(error)
    }
  }
  getCountries()

  const selectedCountry = ref<Item | null>(null)
  const selectCountry = async (country: Item): Promise<void> => {
    selectedCountry.value = country

    form.value.countryUuid = country.uuid

    await getRegions()
  }

  const regions = ref<Item[]>([])
  const getRegions = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
        params: {
          countryUuid: form.value.countryUuid,
          searchKey: text
        }
      })
      regions.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const selectedRegion = ref<Item | null>(null)
  const selectRegion = (region: Item): void => {
    selectedRegion.value = region

    form.value.regionUuid = region.uuid
  }

  const individuals = ref<Item[]>([])
  const getIndividuals = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_INDIVIDUALS({
        params: {
          searchKey: text
        }
      })
      individuals.value =
        data.map((individual: any) => {
          return {
            ...individual,
            name: `${individual.name || ''} ${individual.surname || ''} ${individual.patronomicName || ''}`.trim()
          }
        }) || []
    } catch (error) {
      console.error(error)
    }
  }

  const selectedDirector = ref<Item | null>(null)
  const selectDirector = (individual: Item): void => {
    selectedDirector.value = individual
    form.value.directorUuid = individual.uuid
    closePopUpDirector()
  }

  const showPopUpDirector = ref<boolean>(false)
  const openPopUpDirector = () => {
    getIndividuals()
    showPopUpDirector.value = true
  }

  const closePopUpDirector = () => {
    showPopUpDirector.value = false
  }

  const selectedFounders = ref<Item[]>([])
  const selectFounder = (individuals: Item[]): void => {
    selectedFounders.value = individuals
    closePopUpFounder()
  }

  const showPopUpFounder = ref<boolean>(false)
  const openPopUpFounder = () => {
    getIndividuals()
    showPopUpFounder.value = true
  }

  const closePopUpFounder = () => {
    showPopUpFounder.value = false
  }

  const loadingIndividual = ref<boolean>(false)

  const saveIndividualDirector = async (form: Individual): Promise<void> => {
    try {
      loadingIndividual.value = true

      const { data } = await ADD_INDIVIDUAL({
        data: form
      })
      selectedDirector.value = {
        uuid: data,
        name: `${form.name || ''} ${form.surname || ''} ${form.patronomicName || ''}`.trim()
      }

      closePopUpIndividual()
      getIndividuals()
    } catch (error) {
      console.error(error)
    } finally {
      loadingIndividual.value = false
    }
  }

  const saveIndividualFounder = async (form: Individual): Promise<void> => {
    try {
      loadingIndividual.value = true
      const { data } = await ADD_INDIVIDUAL({
        data: form
      })
      selectedFounders.value.push({
        uuid: data,
        name: `${form.name || ''} ${form.surname || ''} ${form.patronomicName || ''}`.trim()
      })

      closePopUpIndividual()
      getIndividuals()
    } catch (error) {
      console.error(error)
    } finally {
      loadingIndividual.value = false
    }
  }

  const showPopUpIndividualDirector = ref<boolean>(false)
  const openPopUpIndividualDirector = (): void => {
    showPopUpIndividualDirector.value = true
  }
  const showPopUpIndividualFounder = ref<boolean>(false)
  const openPopUpIndividualFounder = (): void => {
    showPopUpIndividualFounder.value = true
  }
  const closePopUpIndividual = (): void => {
    showPopUpIndividualDirector.value = false
    showPopUpIndividualFounder.value = false
  }

  const foundersName = computed((): string => {
    form.value.founderUuids = selectedFounders.value.map((individual: Item) => individual.uuid).join(', ')

    return selectedFounders.value.map((individual: Item): string => individual.name).join(', ')
  })

  const {
    fileData: membershipApplication,
    uploadFile: uploadMembershipApplication,
    openFile: openMembershipApplication
  } = fileUploader()
  const {
    fileData: certificateOfForeignEconomicRelations,
    uploadFile: uploadCertificateOfForeignEconomicRelations,
    openFile: openCertificateOfForeignEconomicRelations
  } = fileUploader()

  const {
    fileData: extractFromUsreo,
    uploadFile: uploadExtractFromUsreo,
    openFile: openExtractFromUsreo
  } = fileUploader()

  const {
    fileData: certificateOfStateRegistration,
    uploadFile: uploadCertificateOfStateRegistration,
    openFile: openCertificateOfStateRegistration
  } = fileUploader()

  const {
    fileData: charterOfTheEnterprise,
    uploadFile: uploadCharterOfTheEnterprise,
    openFile: openCharterOfTheEnterprise
  } = fileUploader()

  const {
    fileData: paymentOfTheEntranceMembership,
    uploadFile: uploadPaymentOfTheEntranceMembership,
    openFile: openPaymentOfTheEntranceMembership
  } = fileUploader()
  const {
    fileData: foreignCompaniesLogo,
    uploadFile: uploadForeignCompaniesLogo,
    openFile: openForeignCompaniesLogo
  } = fileUploader()

  const close = () => {
    emit('close')
  }

  const save = () => {
    form.value.membershipApplicationUuid = membershipApplication.value.uuid
    form.value.certificateOfForeignEconomicRelationsUuid = certificateOfForeignEconomicRelations.value.uuid
    form.value.extractFromUsreoUuid = extractFromUsreo.value.uuid
    form.value.certificateOfStateRegistrationUuid = certificateOfStateRegistration.value.uuid
    form.value.charterOfTheEnterpriseUuid = charterOfTheEnterprise.value.uuid
    form.value.paymentOfTheEntranceMembershipFeeUuid = paymentOfTheEntranceMembership.value.uuid
    form.value.logoUuid = foreignCompaniesLogo.value.uuid

    if (checkValidation()) {
      emit('save', form.value)
    }
  }

  const fileDataToForm = (data: any) => {
    return {
      uuid: data.uuid,
      name: data.name,
      path: data.path,
      progress: 0
    }
  }

  const getData = async (): Promise<void> => {
    if (!props.item) return
    form.value = {
      uuid: props.item.uuid,
      name: props.item.name,
      phoneNumber: props.item.phoneNumber,
      email: props.item.email,
      fullAddress: props.item.fullAddress,
      fax: props.item.fax,
      webSite: props.item.webSite,
      typeWork: props.item.typeWork,
      countryUuid: '',
      regionUuid: '',
      directorUuid: '',
      typeActivityUuids: '',
      founderUuids: '',
      membershipApplicationUuid: '',
      certificateOfForeignEconomicRelationsUuid: '',
      extractFromUsreoUuid: '',
      certificateOfStateRegistrationUuid: '',
      charterOfTheEnterpriseUuid: '',
      paymentOfTheEntranceMembershipFeeUuid: '',
      logoUuid: props.item?.logo?.uuid || ''
    }
    if (props.item.countryDTO) await selectCountry(props.item.countryDTO)
    props.item.regionDTO && selectRegion(props.item.regionDTO)

    if (props.item.director) {
      props.item.director.name = `${props.item.director.name || ''} ${props.item.director.surname || ''} ${
        props.item.director.patronomicName || ''
      }`.trim()

      selectDirector(props.item.director)
    }
    props.item.founders =
      props.item.founders?.map((founder) => {
        return {
          ...founder,
          name: `${founder.name || ''} ${founder.surname || ''} ${founder.patronomicName || ''}`.trim()
        }
      }) || []

    selectFounder(props.item.founders)

    props.item.typeActivityDTOS?.length && selectKindOfActivities(props.item.typeActivityDTOS)

    props.item.membershipApplication && (membershipApplication.value = fileDataToForm(props.item.membershipApplication))
    props.item.certificateOfForeignEconomicRelations &&
      (certificateOfForeignEconomicRelations.value = fileDataToForm(props.item.certificateOfForeignEconomicRelations))
    props.item.extractFromUsreo && (extractFromUsreo.value = fileDataToForm(props.item.extractFromUsreo))
    props.item.certificateOfStateRegistration &&
      (certificateOfStateRegistration.value = fileDataToForm(props.item.certificateOfStateRegistration))
    props.item.charterOfTheEnterprise &&
      (charterOfTheEnterprise.value = fileDataToForm(props.item.charterOfTheEnterprise))
    props.item.paymentOfTheEntranceMembershipFee &&
      (paymentOfTheEntranceMembership.value = fileDataToForm(props.item.paymentOfTheEntranceMembershipFee))
    props.item.logo && (foreignCompaniesLogo.value = fileDataToForm(props.item.logo))
  }

  getData()

  const error = ref<boolean>(false)
  const checkValidation = () => {
    if (required(form.value.name)) {
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
    :title="form.uuid ? t('foreignCompanies.saveForeignCompany') : t('foreignCompanies.addForeignCompany')"
    width="1020"
  >
    <my-row>
      <my-col cols="6">
        <text-field
          v-model.trim="form.name"
          :disabled="loading"
          :error="error && !form.name"
          :label="t('foreignCompanies.company')"
          :placeholder="t('foreignCompanies.title')"
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field
          @click:input="openPopUpSelectKindOfActivity"
          :value="kindOfActivitiesName"
          :disabled="loading"
          :label="t('foreignCompanies.kindOfActivity')"
          :placeholder="t('foreignCompanies.kindOfActivity')"
          background
          append-icon="chevronBottom"
          type="button"
        />
      </my-col>
      <my-col cols="6">
        <text-field
          :label="t('foreignCompanies.typeOfProperty')"
          :value="t('foreignCompanies.foreignCompany')"
          background
          disabled
        />
      </my-col>
      <my-col cols="6">
        <text-field v-model.trim="form.typeWork" :label="t('typeOfWork')" :disabled="loading" background />
      </my-col>
      <my-col cols="6" class="flex flex-y-end gap-10">
        <text-field
          @click:input="openPopUpDirector"
          :value="selectedDirector?.name"
          :disabled="loading"
          :label="t('foreignCompanies.director')"
          :placeholder="t('foreignCompanies.director')"
          background
          append-icon="chevronBottom"
          type="button"
        />
        <my-button @click="openPopUpIndividualDirector" prevIcon="addCircle" onlyIcon />
      </my-col>
      <my-col cols="6" class="flex flex-y-end gap-10">
        <text-field
          @click:input="openPopUpFounder"
          :value="foundersName"
          :disabled="loading"
          :label="t('foreignCompanies.founder')"
          :placeholder="t('foreignCompanies.founder')"
          background
          append-icon="chevronBottom"
          type="button"
        />
        <my-button @click="openPopUpIndividualFounder" prevIcon="addCircle" onlyIcon />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.phoneNumber"
          :disabled="loading"
          :label="t('foreignCompanies.phone')"
          :placeholder="t('foreignCompanies.phone')"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.email"
          :disabled="loading"
          :label="t('foreignCompanies.email')"
          :placeholder="t('foreignCompanies.email')"
          background
        />
      </my-col>
      <my-col cols="6">
        <dropdown
          @select-item="selectCountry"
          @search="getCountries"
          :items="countries"
          :selected-item="selectedCountry"
          :disabled="loading"
          :label="t('foreignCompanies.selectCountry')"
          :placeholder="t('foreignCompanies.country')"
          background
          searchable
        />
      </my-col>
      <my-col cols="6">
        <dropdown
          @select-item="selectRegion"
          @search="getRegions"
          :items="regions"
          :selected-item="selectedRegion"
          :disabled="!selectedCountry || loading"
          :label="t('foreignCompanies.selectRegionCity')"
          :placeholder="t('foreignCompanies.regionCity')"
          background
          searchable
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.fullAddress"
          :label="t('foreignCompanies.fullAddress')"
          :placeholder="t('foreignCompanies.address')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadForeignCompaniesLogo"
          @open-file="openForeignCompaniesLogo"
          :show="foreignCompaniesLogo.path"
          :value="foreignCompaniesLogo.name"
          :progress="foreignCompaniesLogo.progress"
          :disabled="loading"
          :label="t('enterpreneur.logo')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.fax"
          :label="t('foreignCompanies.fax')"
          :placeholder="t('foreignCompanies.address')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.webSite"
          :disabled="loading"
          :error="!!form.webSite ? !site(form.webSite) : false"
          :label="t('foreignCompanies.webSite')"
          placeholder="https://example.com"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadMembershipApplication"
          @open-file="openMembershipApplication"
          :show="membershipApplication.path"
          :value="membershipApplication.name"
          :progress="membershipApplication.progress"
          :disabled="loading"
          :label="t('foreignCompanies.commerceIndustryDetails')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadCertificateOfForeignEconomicRelations"
          @open-file="openCertificateOfForeignEconomicRelations"
          :show="certificateOfForeignEconomicRelations.path"
          :value="certificateOfForeignEconomicRelations.name"
          :progress="certificateOfForeignEconomicRelations.progress"
          :disabled="loading"
          :label="t('foreignCompanies.certificateOfImplementation')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadExtractFromUsreo"
          @open-file="openExtractFromUsreo"
          :show="extractFromUsreo.path"
          :value="extractFromUsreo.name"
          :progress="extractFromUsreo.progress"
          :disabled="loading"
          :label="t('foreignCompanies.extractOfUsreo')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadCertificateOfStateRegistration"
          @open-file="openCertificateOfStateRegistration"
          :show="certificateOfStateRegistration.path"
          :value="certificateOfStateRegistration.name"
          :progress="certificateOfStateRegistration.progress"
          :disabled="loading"
          :label="t('foreignCompanies.certificateOfStateRegistration')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadCharterOfTheEnterprise"
          @open-file="openCharterOfTheEnterprise"
          :show="charterOfTheEnterprise.path"
          :value="charterOfTheEnterprise.name"
          :progress="charterOfTheEnterprise.progress"
          :disabled="loading"
          :label="t('foreignCompanies.charterOfEnterprise')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadPaymentOfTheEntranceMembership"
          @open-file="openPaymentOfTheEntranceMembership"
          :show="paymentOfTheEntranceMembership.path"
          :value="paymentOfTheEntranceMembership.name"
          :progress="paymentOfTheEntranceMembership.progress"
          :disabled="loading"
          :label="t('foreignCompanies.paymentOrder')"
          :placeholder="t('foreignCompanies.selectFile')"
          background
        />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :disabled="loading" :title="t('cancel')" outline />
        <my-button @click="save" :loading="loading" :title="form.uuid ? t('save') : t('add')" />
      </div>
    </template>
  </pop-up-body>

  <teleport to="#pop-up">
    <pop-up-select-checkbox
      @save="selectKindOfActivities"
      @close="closePopUpSelectKindOfActivity"
      :selectedItems="selectedKindOfActivities"
      :items="kindOfActivities"
      v-if="showPopUpSelectKindOfActivity"
      :title="t('foreignCompanies.kindOfActivity')"
    />
    <pop-up-select
      @save="selectDirector"
      @close="closePopUpDirector"
      @search="getIndividuals"
      :selected-item="selectedDirector"
      :items="individuals"
      v-if="showPopUpDirector"
      searchable
      :title="t('foreignCompanies.director')"
    />
    <pop-up-individual
      @save="saveIndividualDirector"
      @close="closePopUpIndividual"
      :loading="loadingIndividual"
      v-if="showPopUpIndividualDirector"
    />
    <pop-up-individual
      @save="saveIndividualFounder"
      @close="closePopUpIndividual"
      :loading="loadingIndividual"
      v-if="showPopUpIndividualFounder"
    />
    <pop-up-select-checkbox
      @save="selectFounder"
      @close="closePopUpFounder"
      @search="getIndividuals"
      :selectedItems="selectedFounders"
      :items="individuals"
      v-if="showPopUpFounder"
      searchable
      :title="t('foreignCompanies.founder')"
    />
  </teleport>
</template>

<style scoped></style>
