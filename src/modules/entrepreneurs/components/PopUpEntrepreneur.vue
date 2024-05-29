<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import FileUploader from '@/UI/FileUploader.vue'
  import PopUpSelect from '@/components/PopUpSelect.vue'
  import PopUpIndividual from '@/modules/individuals/components/PopUpIndividual.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import { fileUploader } from '@/composables/fileUploader'

  import { useValidators } from '@/helpers/validators'

  import { Item, EntrepreneurData, EntrepreneurSave } from '../types'
  import { Individual } from '@/modules/individuals/types'

  import { GET_INDIVIDUALS, GET_KIND_OF_ACTIVITIES } from '../api/other'
  import { ADD_INDIVIDUAL } from '@/modules/individuals/api'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<EntrepreneurData | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { required, site } = useValidators()
  const { t } = useI18n()

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
    fileData: patentCertifyingPayment,
    uploadFile: uploadPatentCertifyingPayment,
    openFile: openPatentCertifyingPayment
  } = fileUploader()
  const {
    fileData: registrationCertificateOfEntrepreneur,
    uploadFile: uploadRegistrationCertificateOfEntrepreneur,
    openFile: openRegistrationCertificateOfEntrepreneur
  } = fileUploader()
  const {
    fileData: entrepreneurStatisticalCodes,
    uploadFile: uploadEntrepreneurStatisticalCodes,
    openFile: openEntrepreneurStatisticalCodes
  } = fileUploader()
  const {
    fileData: certificateOfTaxRegistration,
    uploadFile: uploadCertificateOfTaxRegistration,
    openFile: openCertificateOfTaxRegistration
  } = fileUploader()
  const {
    fileData: enterpreneurLogo,
    uploadFile: uploadEnterpreneurLogo,
    openFile: openEnterpreneurLogo
  } = fileUploader()

  const individuals = ref<Item[]>([])
  const getIndividuals = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_INDIVIDUALS({
        params: {
          searchKey: text
        }
      })

      individuals.value =
        data?.map((individual: any) => ({
          uuid: individual.uuid,
          name: `${individual.name || ''} ${individual.surname || ''} ${individual.patronomicName || ''}`.trim()
        })) || []
    } catch (error) {
      console.error(error)
    }
  }

  getIndividuals()

  const selectedIndividual = ref<Item | null>(null)
  const selectIndividual = (individual: Item): void => {
    selectedIndividual.value = individual

    closePopUpSelectEntrepreneur()
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

  const typeActivityUuids = ref<string>('')
  const kindOfActivitiesName = computed((): string => {
    typeActivityUuids.value =
      selectedKindOfActivities.value.map((kindOfActivity: Item): string => kindOfActivity.uuid).join(', ') || ''
    return selectedKindOfActivities.value.map((kindOfActivity: Item): string => kindOfActivity.name).join(', ') || ''
  })

  const showPopUpSelectKindOfActivity = ref<boolean>(false)
  const openPopUpSelectKindOfActivity = () => {
    showPopUpSelectKindOfActivity.value = true
  }
  const closePopUpSelectKindOfActivity = () => {
    showPopUpSelectKindOfActivity.value = false
  }

  const webSite = ref<string>('')
  const typeWork = ref<string>('')
  const close = () => {
    emit('close')
  }
  const save = () => {
    const form = {
      personUuid: selectedIndividual.value?.uuid,
      typeActivityUuids: typeActivityUuids.value,
      membershipApplicationUuid: membershipApplication.value.uuid,
      certificateOfForeignEconomicRelationsUuid: certificateOfForeignEconomicRelations.value.uuid,
      patentCertifyingPaymentUuid: patentCertifyingPayment.value.uuid,
      registrationCertificateOfEntrepreneurUuid: registrationCertificateOfEntrepreneur.value.uuid,
      entrepreneurStatisticalCodesUuid: entrepreneurStatisticalCodes.value.uuid,
      certificateOfTaxRegistrationUuid: certificateOfTaxRegistration.value.uuid,
      logoUuid: enterpreneurLogo.value.uuid,
      webSite: webSite.value,
      typeWork: typeWork.value
    } as EntrepreneurSave

    if (props.item?.uuid) {
      form.entrepreneurUuid = props.item.uuid
    }

    if (checkValidation()) {
      emit('save', form)
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

  const showPopUpSelectEntrepreneur = ref<boolean>(false)
  const openPopUpSelectEntrepreneur = (): void => {
    showPopUpSelectEntrepreneur.value = true
  }
  const closePopUpSelectEntrepreneur = (): void => {
    showPopUpSelectEntrepreneur.value = false
  }

  const loadingIndividual = ref<boolean>(false)

  const saveIndividual = async (form: Individual): Promise<void> => {
    try {
      loadingIndividual.value = true
      const { data } = await ADD_INDIVIDUAL({
        data: form
      })
      selectedIndividual.value = {
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

  const error = ref<boolean>(false)
  const checkValidation = () => {
    if (required(selectedIndividual.value?.uuid)) {
      return true
    } else {
      error.value = false
      setTimeout(() => {
        error.value = true
      }, 0)
      return false
    }
  }

  if (props.item) {
    selectedIndividual.value = {
      uuid: props.item.personDTO.uuid,
      name: `${props.item.personDTO.name || ''} ${props.item.personDTO.surname || ''} ${
        props.item.personDTO.patronomicName || ''
      }`
    }

    props.item.typeActivityDTOS?.length && selectKindOfActivities(props.item.typeActivityDTOS)

    props.item.membershipApplication && (membershipApplication.value = fileDataToForm(props.item.membershipApplication))
    props.item.certificateOfForeignEconomicRelations &&
      (certificateOfForeignEconomicRelations.value = fileDataToForm(props.item.certificateOfForeignEconomicRelations))
    props.item.patentCertifyingPayment &&
      (patentCertifyingPayment.value = fileDataToForm(props.item.patentCertifyingPayment))
    props.item.registrationCertificateOfEntrepreneur &&
      (registrationCertificateOfEntrepreneur.value = fileDataToForm(props.item.registrationCertificateOfEntrepreneur))
    props.item.entrepreneurStatisticalCodes &&
      (entrepreneurStatisticalCodes.value = fileDataToForm(props.item.entrepreneurStatisticalCodes))
    props.item.certificateOfTaxRegistration &&
      (certificateOfTaxRegistration.value = fileDataToForm(props.item.certificateOfTaxRegistration))
    props.item.logo && (enterpreneurLogo.value = fileDataToForm(props.item.logo))
    webSite.value = props.item.webSite || ''
    typeWork.value = props.item.typeWork || ''
  }
</script>

<template>
  <pop-up-body
    @close="close"
    :title="props.item?.uuid ? t('enterpreneur.saveEntrepreneur') : t('enterpreneur.addEntrepreneur')"
    width="1020"
  >
    <my-row>
      <my-col cols="12">
        <div class="flex flex-y-end gap-10">
          <text-field
            @click:input="openPopUpSelectEntrepreneur"
            :value="selectedIndividual?.name"
            :disabled="loading"
            :error="error && !selectedIndividual?.uuid"
            :label="t('enterpreneur.chooseEntrepreneur')"
            :placeholder="t('enterpreneur.chooseEntrepreneur')"
            background
            required
            append-icon="chevronBottom"
            type="button"
          />
          <my-button @click="openPopUpIndividual" prevIcon="addCircle" onlyIcon />
        </div>
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadEnterpreneurLogo"
          @open-file="openEnterpreneurLogo"
          :show="enterpreneurLogo.path"
          :value="enterpreneurLogo.name"
          :progress="enterpreneurLogo.progress"
          :disabled="loading"
          :label="t('enterpreneur.logo')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="webSite"
          :error="!!webSite ? !site(webSite) : false"
          :label="t('privateCompanies.webSite')"
          placeholder="https://example.com"
          :disabled="loading"
          background
        />
      </my-col>
      <my-col cols="6">
        <text-field
          @click:input="openPopUpSelectKindOfActivity"
          :value="kindOfActivitiesName"
          :disabled="loading"
          :label="t('enterpreneur.kindOfActivity')"
          :placeholder="t('enterpreneur.kindOfActivity')"
          background
          append-icon="chevronBottom"
          type="button"
        />
      </my-col>
      <my-col cols="6">
        <text-field v-model.trim="typeWork" :label="t('typeOfWork')" :disabled="loading" background />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadMembershipApplication"
          @open-file="openMembershipApplication"
          :show="membershipApplication.path"
          :value="membershipApplication.name"
          :progress="membershipApplication.progress"
          :disabled="loading"
          :label="t('enterpreneur.applicationWithRequest')"
          :placeholder="t('enterpreneur.selectFile')"
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
          :label="t('enterpreneur.certificateOfImplementation')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadPatentCertifyingPayment"
          @open-file="openPatentCertifyingPayment"
          :show="patentCertifyingPayment.path"
          :value="patentCertifyingPayment.name"
          :progress="patentCertifyingPayment.progress"
          :disabled="loading"
          :label="t('enterpreneur.patentCertificatingThePayment')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadRegistrationCertificateOfEntrepreneur"
          @open-file="openRegistrationCertificateOfEntrepreneur"
          :show="registrationCertificateOfEntrepreneur.path"
          :value="registrationCertificateOfEntrepreneur.name"
          :progress="registrationCertificateOfEntrepreneur.progress"
          :disabled="loading"
          :label="t('enterpreneur.registrationCertificateOfPrivate')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadEntrepreneurStatisticalCodes"
          @open-file="openEntrepreneurStatisticalCodes"
          :show="entrepreneurStatisticalCodes.path"
          :value="entrepreneurStatisticalCodes.name"
          :progress="entrepreneurStatisticalCodes.progress"
          :disabled="loading"
          :label="t('enterpreneur.informaitonLetterOfProvision')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
      <my-col cols="6">
        <file-uploader
          @change-file="uploadCertificateOfTaxRegistration"
          @open-file="openCertificateOfTaxRegistration"
          :show="certificateOfTaxRegistration.path"
          :value="certificateOfTaxRegistration.name"
          :progress="certificateOfTaxRegistration.progress"
          :disabled="loading"
          :label="t('enterpreneur.certificateOfTaxRegistration')"
          :placeholder="t('enterpreneur.selectFile')"
          background
        />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :disabled="loading" :title="t('cancel')" outline />
        <my-button @click="save" :disabled="loading" :loading="loading" :title="t('save')" />
      </div>
    </template>
  </pop-up-body>

  <teleport to="#pop-up">
    <pop-up-select
      @save="selectIndividual"
      @close="closePopUpSelectEntrepreneur"
      @search="getIndividuals"
      :items="individuals"
      v-if="showPopUpSelectEntrepreneur"
      searchable
      :title="t('enterpreneur.chooseEntrepreneur')"
    />
    <pop-up-individual
      @save="saveIndividual"
      @close="closePopUpIndividual"
      :loading="loadingIndividual"
      v-if="showPopUpIndividual"
    />
    <pop-up-select-checkbox
      @save="selectKindOfActivities"
      @close="closePopUpSelectKindOfActivity"
      :selectedItems="selectedKindOfActivities"
      :items="kindOfActivities"
      v-if="showPopUpSelectKindOfActivity"
      :title="t('enterpreneur.kindOfActivity')"
    />
  </teleport>
</template>

<style scoped></style>
