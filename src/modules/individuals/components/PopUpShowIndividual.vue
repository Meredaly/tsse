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
  import FileUploader from '@/UI/FileUploader.vue'
  import { Individual } from '../types'

  const emit = defineEmits(['close'])
  const { t } = useI18n()

  const props = defineProps({
    item: { type: Object as PropType<Individual | null>, default: null }
  })

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
    image: {
      extension: '',
      name: '',
      path: '',
      size: 0,
      uuid: ''
    },
    copyPassport: {
      extension: '',
      name: '',
      path: '',
      size: 0,
      uuid: ''
    }
  })

  const close = () => {
    emit('close')
  }
  const directorCompanies = ref<string>('')
  const founderCompanies = ref<string>('')
  const entrepreneur = ref<string>('')

  const getItem = async (): Promise<void> => {
    if (props.item) {
      form.value = {
        uuid: props.item.uuid,
        name: props.item.name,
        surname: props.item.surname,
        patronomicName: props.item.patronomicName,
        birthPlace: props.item.birthPlace,
        birthDate: props.item.birthDate,
        fullAddressOfResidence: props.item.fullAddressOfResidence,
        phoneNumber: props.item.phoneNumber,
        countryUuid: props.item.countryDTO?.uuid,
        regionUuid: props.item.regionDTO?.uuid,
        fax: props.item.fax,
        email: props.item.email,
        education: props.item.education,
        experience: props.item.experience,
        knowledgeOfLanguages: props.item.knowledgeOfLanguages,
        imageUuid: props.item.image?.uuid,
        image: props.item.image,
        copyPassport: props.item.copyPassport
      }

      directorCompanies.value = props.item.directorCompanies?.map((company) => company.name).join(', ') || 'Не является'
      founderCompanies.value = props.item.founderCompanies?.map((company) => company.name).join(', ') || 'Не является'
      entrepreneur.value = props.item.isEntrepreneur ? 'Да' : 'Не является'
    }
  }
  getItem()
</script>

<template>
  <pop-up-body @close="close" :title="t('individuals.informations')" width="1020">
    <my-row>
      <my-col cols="4">
        <text-field
          v-model.trim="form.surname"
          :label="t('individuals.surname')"
          :placeholder="t('individuals.surname')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.name"
          :label="t('individuals.name')"
          :placeholder="t('individuals.name')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.patronomicName"
          :label="t('individuals.fullName')"
          :placeholder="t('individuals.fullName')"
          disabled
          background
        />
      </my-col>
      <my-col cols="4">
        <file-uploader
          :show="form.image?.path"
          :value="form.image?.name"
          disabled
          :label="t('individuals.photo')"
          :placeholder="t('individuals.photo')"
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.birthPlace"
          :label="t('individuals.placeOfBirth')"
          :placeholder="t('individuals.address')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <datepicker
          v-model="form.birthDate"
          :label="t('individuals.dateOfBirth')"
          :placeholder="t('individuals.calendar')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <file-uploader
          :show="form.copyPassport?.path"
          :value="form.copyPassport?.name"
          disabled
          :label="t('individuals.passport')"
          :placeholder="t('individuals.passport')"
          background
        />
      </my-col>
      <my-col cols="8">
        <text-field
          v-model.trim="form.fullAddressOfResidence"
          :label="t('individuals.fullResidentialAddress')"
          :placeholder="t('individuals.address')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.phoneNumber"
          :label="t('individuals.phone')"
          :placeholder="t('individuals.phone')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.fax"
          :label="t('individuals.fax')"
          :placeholder="t('individuals.fax')"
          disabled
          background
        />
      </my-col>
      <my-col cols="4">
        <text-field
          v-model.trim="form.email"
          :label="t('individuals.email')"
          :placeholder="t('individuals.email')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="12">
        <text-field
          v-model.trim="form.education"
          :label="t('individuals.education')"
          :placeholder="t('individuals.nameOfEducational')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.experience"
          :label="t('individuals.exprience')"
          :placeholder="t('individuals.previousPlaceOfWork')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.knowledgeOfLanguages"
          :label="t('individuals.languageSkills')"
          :placeholder="t('individuals.languageSkills')"
          disabled
          background
          required
        />
      </my-col>
      <my-col cols="12">
        <div class="divider"></div>
      </my-col>
      <my-col cols="12">
        <div class="text-16-sb">{{ t('individuals.otherInformations') }}</div>
      </my-col>
      <my-col cols="4">
        <text-field :label="t('individuals.director')" :value="directorCompanies" background disabled />
      </my-col>
      <my-col cols="4">
        <text-field :label="t('individuals.founder')" :value="founderCompanies" background disabled />
      </my-col>
      <my-col cols="4">
        <text-field :label="t('individuals.enterpreneur')" :value="entrepreneur" background disabled />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :title="t('cancel')" outline />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped>
  .divider {
    border: 1px solid var(--caption);
    width: 100%;
  }
</style>
