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

  import { GovernmentOrganization, GovernmentOrganizationData, Item } from '../types'
  import { Individual } from '@/modules/individuals/types'

  import { GET_KIND_OF_ACTIVITIES, GET_ORGANIZATIONS, GET_REGIONS, GET_INDIVIDUALS } from '../api/other'
  import { ADD_INDIVIDUAL } from '@/modules/individuals/api'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: {
      type: Object as PropType<GovernmentOrganization | null>,
      default: null
    },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required, site } = useValidators()

  const form = ref<GovernmentOrganizationData>({
    name: '',
    fullAddress: '',
    phoneNumber: '',
    email: '',
    fax: '',
    webSite: '',
    typeWork: '',
    countryUuid: '67a84071-1d6f-4a51-9186-2e4bede0937b',
    regionUuid: '',
    directorUuid: '',
    organizationUuid: '',
    typeActivityUuids: '',
    membershipApplicationUuid: '',
    certificateOfForeignEconomicRelationsUuid: '',
    extractFromUsreoUuid: '',
    certificateOfStateRegistrationUuid: '',
    charterOfTheEnterpriseUuid: '',
    paymentOfTheEntranceMembershipFeeUuid: '',
    logoUuid: ''
  })

  const organizations = ref<Item[]>([])
  const getOrganizations = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_ORGANIZATIONS({
        params: {
          searchKey: text
        }
      })

      organizations.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  getOrganizations()

  const selectedOrganization = ref<Item | null>(null)
  const selectOrganization = (organization: Item): void => {
    selectedOrganization.value = organization

    form.value.organizationUuid = organization.uuid
  }

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

  const regions = ref<Item[]>([])
  const getRegions = async (): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
        params: {
          countryUuid: form.value.countryUuid,
          searchKey: ''
        }
      })
      regions.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  getRegions()

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
  getIndividuals()

  const selectedDirector = ref<Item | null>(null)
  const selectDirector = (individual: Item): void => {
    selectedDirector.value = individual
    form.value.directorUuid = individual.uuid
    closePopUpDirector()
  }

  const showPopUpDirector = ref<boolean>(false)
  const openPopUpDirector = () => {
    showPopUpDirector.value = true
  }

  const closePopUpDirector = () => {
    showPopUpDirector.value = false
  }

  const loadingIndividual = ref<boolean>(false)

  const saveIndividual = async (form: Individual): Promise<void> => {
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

  const showPopUpIndividual = ref<boolean>(false)
  const openPopUpIndividual = (): void => {
    showPopUpIndividual.value = true
  }
  const closePopUpIndividual = (): void => {
    showPopUpIndividual.value = false
  }

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
    fileData: governmentOrganizationsLogo,
    uploadFile: uploadGovernmentOrganizationsLogo,
    openFile: openGovernmentOrganizationsLogo
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
    form.value.logoUuid = governmentOrganizationsLogo.value.uuid

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

  if (props.item) {
    props.item.logo && (governmentOrganizationsLogo.value = fileDataToForm(props.item.logo))
    form.value = {
      uuid: props.item.uuid,
      name: props.item.name,
      fullAddress: props.item.fullAddress,
      phoneNumber: props.item.phoneNumber,
      email: props.item.email,
      fax: props.item.fax,
      webSite: props.item.webSite,
      typeWork: props.item.typeWork,
      countryUuid: '67a84071-1d6f-4a51-9186-2e4bede0937b',
      regionUuid: '',
      directorUuid: '',
      organizationUuid: '',
      typeActivityUuids: '',
      membershipApplicationUuid: '',
      certificateOfForeignEconomicRelationsUuid: '',
      extractFromUsreoUuid: '',
      certificateOfStateRegistrationUuid: '',
      charterOfTheEnterpriseUuid: '',
      paymentOfTheEntranceMembershipFeeUuid: '',
      logoUuid: props.item.logo?.uuid || ''
    }
    props.item.regionDTO && selectRegion(props.item.regionDTO)
    if (props.item.director) {
      props.item.director.name = `${props.item.director.name || ''} ${props.item.director.surname || ''} ${
        props.item.director.patronomicName || ''
      }`.trim()

      selectDirector(props.item.director)
    }
    props.item.organizationDTO && selectOrganization(props.item.organizationDTO)
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
  }

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
    :title="
      form.uuid
        ? t('governmentOrganizations.saveGovernmentOrganization')
        : t('governmentOrganizations.addGovernmentOrganization')
    "
    width="1020"
  >
    <my-row>
      <my-col cols="6">
        <dropdown
          @select-item="selectOrganization"
          @search="getOrganizations"
          :selected-item="selectedOrganization"
          :items="organizations"
          :disabled="loading"
          :label="t('governmentOrganizations.ministry')"
          :placeholder="t('governmentOrganizations.selectMinistry')"
          background
          searchable
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.name"
          :disabled="loading"
          :error="error && !form.name"
          :label="t('governmentOrganizations.company')"
          :placeholder="t('governmentOrganizations.title')"
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          @click:input="openPopUpSelectKindOfActivity"
          :value="kindOfActivitiesName"
          :disabled="loading"
          :label="t('governmentOrganizations.kindOfActivity')"
          :placeholder="t('governmentOrganizations.kindOfActivity')"
          background
          append-icon="chevronBottom"
          type="button"
        />
      </my-col>
      <my-col cols="4">
        <text-field v-model.trim="form.typeWork" :label="t('typeOfWork')" :disabled="loading" background />
      </my-col>
      <my-col cols="4">
        <text-field
          :value="t('governmentOrganizations.stateOrganization')"
          :label="t('governmentOrganizations.typeOfProperty')"
          background
          disabled
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.phoneNumber"
          :disabled="loading"
          :label="t('governmentOrganizations.phone')"
          :placeholder="t('governmentOrganizations.phone')"
          background
        />
      </my-col>
      <my-col cols="6" class="flex flex-y-start">
        <text-field
          v-model.trim="form.email"
          :disabled="loading"
          :label="t('governmentOrganizations.email')"
          :placeholder="t('governmentOrganizations.email')"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field value="Türkmenistan" :label="t('governmentOrganizations.country')" background disabled />
      </my-col>
      <my-col cols="6">
        <dropdown
          :items="regions"
          @select-item="selectRegion"
          :selected-item="selectedRegion"
          :disabled="loading"
          :label="t('governmentOrganizations.selectRegion')"
          :placeholder="t('governmentOrganizations.regionCountry')"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.fullAddress"
          :disabled="loading"
          :label="t('governmentOrganizations.allAddress')"
          :placeholder="t('governmentOrganizations.address')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadGovernmentOrganizationsLogo"
          @open-file="openGovernmentOrganizationsLogo"
          :show="governmentOrganizationsLogo.path"
          :value="governmentOrganizationsLogo.name"
          :progress="governmentOrganizationsLogo.progress"
          :disabled="loading"
          :label="t('enterpreneur.logo')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6" class="flex flex-y-end gap-10">
        <text-field
          @click:input="openPopUpDirector"
          :value="selectedDirector?.name"
          :disabled="loading"
          :label="t('governmentOrganizations.director')"
          :placeholder="t('governmentOrganizations.director')"
          background
          append-icon="chevronBottom"
          type="button"
        />
        <my-button @click="openPopUpIndividual" prevIcon="addCircle" onlyIcon />
      </my-col>
      <my-col cols="3">
        <text-field
          v-model.trim="form.fax"
          :label="t('governmentOrganizations.fax')"
          :placeholder="t('governmentOrganizations.fax')"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="3">
        <text-field
          v-model.trim="form.webSite"
          :error="!!form.webSite ? !site(form.webSite) : false"
          :label="t('governmentOrganizations.webSite')"
          placeholder="https://example.com"
          :disabled="loading"
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
          :label="t('governmentOrganizations.applicationText')"
          :placeholder="t('governmentOrganizations.selectFile')"
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
          :label="t('governmentOrganizations.certificate')"
          :placeholder="t('governmentOrganizations.selectFile')"
          :disabled="loading"
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
          :label="t('governmentOrganizations.extract')"
          :placeholder="t('governmentOrganizations.selectFile')"
          :disabled="loading"
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
          :label="t('governmentOrganizations.certificateOfState')"
          :placeholder="t('governmentOrganizations.selectFile')"
          :disabled="loading"
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
          :label="t('governmentOrganizations.charter')"
          :placeholder="t('governmentOrganizations.selectFile')"
          :disabled="loading"
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
          :label="t('governmentOrganizations.paymentOrder')"
          :placeholder="t('governmentOrganizations.selectFile')"
          :disabled="loading"
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
      :title="t('enterpreneur.kindOfActivity')"
    />
    <pop-up-individual
      @save="saveIndividual"
      @close="closePopUpIndividual"
      :loading="loadingIndividual"
      v-if="showPopUpIndividual"
    />
    <pop-up-select
      @save="selectDirector"
      @close="closePopUpDirector"
      @search="getIndividuals"
      :selected-item="selectedDirector"
      :items="individuals"
      v-if="showPopUpDirector"
      searchable
      :title="t('governmentOrganizations.director')"
    />
  </teleport>
</template>

<style scoped></style>
