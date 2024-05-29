<script setup lang="ts">
  import { ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useI18n } from 'vue-i18n'

  import MyButton from '@/UI/MyButton.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import Datepicker from '@/UI/Datepicker'
  import FileUploader from '@/UI/FileUploader.vue'

  import { getDate } from '@/helpers/date'

  import { fileUploader } from '@/composables/fileUploader'

  import { Item, MemberPreview } from '../types'

  import { GET_MEMBER } from '../api'

  const route = useRoute()
  const router = useRouter()

  const { t } = useI18n()

  const form = ref<MemberPreview>({
    ministry: '',
    name: '',
    kindOfActivity: '',
    typeOfProperty: '',
    director: '',
    directorPhoneNumber: '',
    founder: '',
    phoneNumber: '',
    fax: '',
    site: '',
    email: '',
    country: '',
    region: '',
    address: '',
    isMember: '',
    initialDate: '',
    finalDate: '',
    paymentStatus: '',
    initialDateLastPayment: ''
  })

  const statuses = ref<any>({
    PAYMENT_TIME_HAS_EXPIRED: '__warning',
    PAID: '__success'
  })
  const statusesText = ref<any>({
    PAYMENT_TIME_HAS_EXPIRED: 'Время истекло',
    PAID: 'Оплачено'
  })

  const { fileData, openFile } = fileUploader()

  const getMember = async (): Promise<void> => {
    try {
      const { data } = await GET_MEMBER({
        params: {
          memberUuid: route.params.id
        }
      })
      if (data.typeCocaiotMember === 'IS_COMPANY') {
        form.value = {
          ministry: data.companyDTO?.organizationDTO?.name,
          name: data.companyDTO?.name,
          kindOfActivity: data.companyDTO?.typeActivityDTOS?.map((activity: Item) => activity.name).join(', ') || '',
          typeOfProperty: data.companyDTO?.typeOwnership,
          director: `${data.companyDTO?.director?.name} ${data.companyDTO?.director?.surname || ''} ${
            data.companyDTO?.director?.patronomicName || ''
          }`,
          directorPhoneNumber: data.companyDTO?.director.phoneNumber,
          founder:
            data.companyDTO?.founders
              ?.map((founder: any) => `${founder?.name} ${founder?.surname || ''} ${founder?.patronomicName || ''}`)
              .join(', ') || '',
          phoneNumber: data.companyDTO?.phoneNumber,
          fax: data.companyDTO?.fax,
          site: data.companyDTO?.webSite,
          email: data.companyDTO?.email,
          country: data.companyDTO?.countryDTO?.name,
          region: data.companyDTO?.regionDTO?.name,
          address: data.companyDTO?.fullAddress,
          isMember: data.statusPayment,
          initialDate: data.initialDate,
          finalDate: data.finalDate,
          paymentStatus: data.statusPayment,
          initialDateLastPayment: data.initialDateLastPayment
        }
      } else {
        form.value = {
          ministry: '',
          name: `${data.entrepreneurDTO?.personDTO?.name} ${data.entrepreneurDTO?.personDTO?.surname || ''} ${
            data.entrepreneurDTO?.personDTO?.patronomicName || ''
          }`,
          kindOfActivity: '',
          typeOfProperty: data?.typeCocaiotMember,
          director: '',
          directorPhoneNumber: '',
          founder: '',
          phoneNumber: data.entrepreneurDTO?.personDTO?.phoneNumber,
          fax: data.entrepreneurDTO?.personDTO?.fax,
          site: '',
          email: data.entrepreneurDTO?.personDTO?.email,
          country: data.entrepreneurDTO?.personDTO?.countryDTO?.name,
          region: data.entrepreneurDTO?.personDTO?.regionDTO?.name,
          address: data.entrepreneurDTO?.personDTO?.fullAddressOfResidence,
          isMember: data.statusPayment,
          initialDate: data.initialDate,
          finalDate: data.finalDate,
          paymentStatus: data.statusPayment,
          initialDateLastPayment: data.initialDateLastPayment
        }
      }
      fileData.value.name = data.fileDTO?.name || ''
      fileData.value.path = data.fileDTO?.path || ''
    } catch (error) {
      console.error(error)
    }
  }
  getMember()

  const back = (): void => {
    router.push('/members')
  }
</script>

<template>
  <div class="member-preview __custom-scroll __box">
    <div class="member-preview__header">
      <div class="member-preview__header-left">
        <my-button @click="back" :title="t('members.back')" outline prev-icon="arrowLeft" />
      </div>
      <div class="member-preview__header-right">
        <div class="member-preview__title">{{ t('members.aboutCompany') }}</div>
      </div>
    </div>
    <div class="member-preview__body">
      <my-row>
        <my-col cols="6">
          <text-field :value="form.ministry" :label="t('members.ministry')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.name" :label="t('members.name')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.kindOfActivity" :label="t('members.typeActivity')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="t(form.typeOfProperty)" :label="t('members.typeOwnership')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field :value="form.director" :label="t('members.director')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field :value="form.directorPhoneNumber" :label="t('members.directorNumber')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field :value="form.founder" :label="t('members.founder')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.phoneNumber" :label="t('members.phone')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.fax" :label="t('members.fax')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.site" :label="t('members.site')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field :value="form.email" :label="t('members.email')" disabled />
        </my-col>
        <my-col cols="12">
          <div class="divider"></div>
        </my-col>
        <my-col cols="4">
          <text-field :value="form.country" :label="t('members.country')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field :value="form.region" :label="t('members.regionCity')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field :value="form.address" :label="t('members.fullAddress')" disabled />
        </my-col>
        <my-col cols="6">
          <text-field
            :value="form.isMember === 'PAID' ? t('members.yes') : t('members.no')"
            :label="t('members.companyIsMember') + ' ?'"
            disabled
          />
        </my-col>
        <my-col cols="6">
          <file-uploader
            @open-file="openFile"
            :show="fileData.path"
            :value="fileData.name"
            :label="t('members.paymentDocument')"
            disabled
          />
        </my-col>
        <my-col cols="6">
          <div class="payment-status">
            <p>{{ t('members.companyIsMember') }}</p>
            <p>
              {{ t('members.from') }}: <span class="payment-status__bold">{{ getDate(form.initialDate) }}</span>
            </p>
            <p>
              {{ t('members.to') }}:
              <span :class="`payment-status${statuses[form.paymentStatus]}`">{{ getDate(form.finalDate) }}</span>
            </p>
          </div>
        </my-col>
        <my-col cols="6"> </my-col>
        <my-col cols="12">
          <div class="divider"></div>
        </my-col>
        <my-col cols="4">
          <datepicker :value="form.initialDateLastPayment" :label="t('members.lastPayFrom')" disabled />
        </my-col>
        <my-col cols="4">
          <datepicker :value="form.finalDate" :label="t('members.lastPayTo')" disabled />
        </my-col>
        <my-col cols="4">
          <text-field
            :class="['payment-status-input', statuses[form.paymentStatus]]"
            :value="statusesText[form.paymentStatus]"
            :label="t('members.aboutPaymentStatus')"
            disabled
          />
        </my-col>
      </my-row>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .member-preview {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    // .member-preview__header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
      border-bottom: 1px solid var(--input-background);
      background-color: var(--white);
      position: sticky;
      top: 0;
      left: 0;
    }
    // .member-preview__header-left
    &__header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    // .member-preview__header-right
    &__header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
    }
    // .member-preview__title
    &__title {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: var(--black);
    }
    // .member-preview__body
    &__body {
      flex: 1 1;
      padding: 20px 40px;
    }
  }
  .divider {
    border: 1px solid var(--input-background);
  }

  .payment-status {
    font-style: italic;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    color: #aaaaaa;
    // .payment-status__bold
    &__bold {
      color: var(--black);
    }
    // .payment-status__success
    &__success {
      color: var(--success);
    }
    // .payment-status__warning
    &__warning {
      color: var(--warning);
    }

    // .payment-status__danger
    &__danger {
      color: var(--danger);
    }
  }
  .payment-status-input {
    &.__danger {
      &:deep() {
        input {
          color: var(--danger);
        }
      }
    }
    &.__warning {
      &:deep() {
        input {
          color: var(--warning);
        }
      }
    }
    &.__success {
      &:deep() {
        input {
          color: var(--success);
        }
      }
    }
  }
</style>
