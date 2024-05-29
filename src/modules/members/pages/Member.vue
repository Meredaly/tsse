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
  import PopUpSelect from '@/components/PopUpSelect.vue'

  import { fileUploader } from '@/composables/fileUploader'

  import { useValidators } from '@/helpers/validators'

  import { Candidate, Item, SelectedCandidate } from '../types'

  import { GET_CANDIDATES, GET_CANDIDATE, ADD_MEMBER, EDIT_MEMBER, GET_MEMBER } from '../api'

  const route = useRoute()
  const router = useRouter()

  const { required } = useValidators()
  const { t } = useI18n()

  interface MemberData {
    memberUuid: string
    typeCocaiotMember: string
    fileUuid: string
    initialDate: string
    finalDate: string
  }

  const form = ref<MemberData>({
    memberUuid: '',
    typeCocaiotMember: '',
    fileUuid: '',
    initialDate: '',
    finalDate: ''
  })

  const candidates = ref<Item[]>([])
  const getCandidates = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_CANDIDATES({
        params: {
          searchKey: text
        }
      })
      candidates.value = data.map((candidate: Candidate) => {
        return {
          uuid:
            candidate.typeCocaiotMember === 'IS_COMPANY' ? candidate.companyDTO?.uuid : candidate.entrepreneurDTO?.uuid,
          name:
            candidate.typeCocaiotMember === 'IS_COMPANY'
              ? candidate.companyDTO?.name + ' (Компания)'
              : `${candidate.entrepreneurDTO?.personDTO.name} ${candidate.entrepreneurDTO?.personDTO.surname} ${candidate.entrepreneurDTO?.personDTO.patronomicName} (Предпринимател)`,
          typeCocaiotMember: candidate.typeCocaiotMember
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getCandidates()

  const getCandidate = async (uuid: string, type: string): Promise<any> => {
    try {
      const { data } = await GET_CANDIDATE({
        data: {
          candidateUuid: uuid,
          typeCocaiotMember: type
        }
      })
      if (type === 'IS_COMPANY') {
        return {
          name: data.companyDTO.name,
          componyType: data.companyDTO.typeOwnership,
          kindOfActivity: data.companyDTO.typeActivityDTOS?.map((type: Item) => type.name).join(', ') || '',
          director: data.companyDTO?.director
            ? `${data.companyDTO?.director.name} ${data.companyDTO?.director.surname} ${data.companyDTO?.director.patronomicName}`
            : '',
          address: data.companyDTO?.fullAddress,
          phoneNumber: data.companyDTO?.phoneNumber,
          email: data.companyDTO?.email
        }
      } else {
        return {
          name: `${data.entrepreneurDTO.personDTO.name || ''} ${data.entrepreneurDTO.personDTO.surname || ''} ${
            data.entrepreneurDTO.personDTO.patronomicName || ''
          }`,
          componyType: 'IS_ENTREPRENEUR',
          kindOfActivity: data.entrepreneurDTO.typeActivityDTOS?.map((type: Item) => type.name).join(', ') || '',
          director: '',
          address: data.entrepreneurDTO?.personDTO.fullAddressOfResidence,
          phoneNumber: data.entrepreneurDTO?.personDTO.phoneNumber,
          email: data.entrepreneurDTO?.personDTO.email
        }
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const selectedCandidate = ref<SelectedCandidate | null>(null)
  const selectCandidate = async (candidate: Item): Promise<void> => {
    selectedCandidate.value = await getCandidate(candidate.uuid, candidate.typeCocaiotMember)
    form.value.memberUuid = candidate.uuid
    form.value.typeCocaiotMember = candidate.typeCocaiotMember
    closePopUpSelectCompany()
  }

  const { fileData, uploadFile, openFile } = fileUploader()

  const loading = ref<boolean>(false)
  const saveMember = async (): Promise<void> => {
    form.value.fileUuid = fileData.value.uuid
    loading.value = true
    if (!checkValidation()) {
      return
    }
    try {
      const initialDateReverse = form.value.initialDate.split('-')
      const finalDateReverse = form.value.finalDate.split('-')

      if (route.params.id !== 'add') {
        await EDIT_MEMBER({
          params: {
            memberUuid: route.params.id
          },
          data: {
            newMemberUuid: form.value.memberUuid,
            typeCocaiotMember: form.value.typeCocaiotMember,
            fileUuid: form.value.fileUuid,
            initialDate: initialDateReverse[2] + '-' + initialDateReverse[1] + '-' + initialDateReverse[0],
            finalDate: finalDateReverse[2] + '-' + finalDateReverse[1] + '-' + finalDateReverse[0]
          }
        })
      } else {
        await ADD_MEMBER({
          data: {
            ...form.value,
            initialDate: initialDateReverse[2] + '-' + initialDateReverse[1] + '-' + initialDateReverse[0],
            finalDate: finalDateReverse[2] + '-' + finalDateReverse[1] + '-' + finalDateReverse[0]
          }
        })
      }
      back()
    } catch (error) {
      console.error(error)
      loading.value = false
    }
  }

  const error = ref<boolean>(false)
  const checkValidation = () => {
    if (required(form.value.typeCocaiotMember) && required(form.value.fileUuid) && required(form.value.initialDate)) {
      return true
    } else {
      error.value = false
      setTimeout(() => {
        error.value = true
      }, 0)
      return false
    }
  }

  const back = (): void => {
    router.push('/members')
  }

  const showPopUpCompony = ref<boolean>(false)
  const openPopUpSelectCompany = (): void => {
    showPopUpCompony.value = true
  }
  const closePopUpSelectCompany = (): void => {
    showPopUpCompony.value = false
  }

  const getMember = async (): Promise<void> => {
    try {
      const { data } = await GET_MEMBER({
        params: {
          memberUuid: route.params.id
        }
      })
      form.value = {
        memberUuid: data.companyDTO?.uuid || data.entrepreneurDTO?.uuid,
        typeCocaiotMember: data.typeCocaiotMember,
        fileUuid: data.fileDTO.path,
        initialDate: data.initialDate,
        finalDate: data.finalDate
      }

      selectedCandidate.value = await getCandidate(
        data.companyDTO?.uuid || data.entrepreneurDTO?.uuid,
        data.typeCocaiotMember
      )
      fileData.value = {
        uuid: data.fileDTO?.uuid || '',
        name: data.fileDTO?.name || '',
        path: data.fileDTO?.path || '',
        progress: 0
      }
    } catch (error) {
      console.error(error)
    }
  }

  if (route.params.id !== 'add') {
    getMember()
  }

  const typesOwnership = ref<any>({
    COMMERCIAL_SOCIETY: 'Хозяйственные общества',
    PERSONAL_ENTERPRISE: 'Частные предприятия',
    FOREIGN_COMPANY: 'Иностранные компании',
    STATE_ORGANIZATION: 'Государственные организаци',
    IS_ENTREPRENEUR: 'Предприниматель'
  })
</script>

<template>
  <div class="member __custom-scroll __box">
    <div class="member__header">
      <div class="member__header-left">
        <my-button @click="back" :title="t('members.back')" outline prev-icon="arrowLeft" />
      </div>
      <div class="member__header-right">
        <div class="member__title">{{ route.params.id === 'add' ? t('members.addendum') : t('members.editing') }}</div>
      </div>
    </div>
    <div class="member__body">
      <div class="member__info">
        <my-row>
          <my-col cols="12">
            <div class="member__title">{{ t('members.information') }}</div>
          </my-col>
          <my-col cols="6" class="flex flex-y-start">
            <text-field
              @click:input="openPopUpSelectCompany"
              :value="selectedCandidate?.name"
              :error="error && !form.typeCocaiotMember"
              :label="t('members.companyEntrepreneur')"
              :disabled="loading"
              required
              type="button"
              append-icon="chevronBottom"
              :message="t('members.companyEntrepreneurMessage')"
            />
          </my-col>
          <my-col cols="6">
            <file-uploader
              @change-file="uploadFile"
              @open-file="openFile"
              :show="fileData.path"
              :value="fileData.name"
              :progress="fileData.progress"
              :disabled="loading"
              :label="t('members.paymentStatus')"
              :message="t('members.paymentStatusText')"
            />
          </my-col>
          <my-col cols="6">
            <datepicker
              v-model="form.initialDate"
              :error="error && !form.initialDate"
              :disabled="loading"
              :label="t('members.periodFrom')"
              :placeholder="t('members.calendar')"
              required
              :message="t('members.periodFromText')"
            />
          </my-col>
          <my-col cols="6">
            <datepicker
              v-model="form.finalDate"
              :error="error && !form.finalDate"
              :disabled="loading"
              :label="t('members.periodTo')"
              :placeholder="t('members.calendar')"
              required
              :message="t('members.periodToText')"
            />
          </my-col>
        </my-row>
      </div>
      <div v-if="selectedCandidate" class="member__form">
        <my-row>
          <my-col cols="6">
            <text-field
              :value="typesOwnership[selectedCandidate?.componyType]"
              :label="t('members.componyType')"
              :placeholder="t('members.componyType')"
              disabled
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="selectedCandidate?.kindOfActivity"
              :label="t('members.typeActivity')"
              :placeholder="t('members.typeActivity')"
              disabled
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="selectedCandidate?.director"
              :label="t('members.director')"
              :placeholder="t('members.fullName')"
              disabled
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="selectedCandidate?.address"
              :label="t('members.address')"
              :placeholder="t('members.address')"
              disabled
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="selectedCandidate?.phoneNumber"
              :label="t('members.phoneNumber')"
              :placeholder="t('members.phoneNumber')"
              disabled
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="selectedCandidate?.email"
              :label="t('members.email')"
              :placeholder="t('members.email')"
              disabled
            />
          </my-col>
        </my-row>
      </div>
    </div>
    <div class="member__footer">
      <div class="member__footer-left"></div>
      <div class="member__footer-right">
        <my-button @click="saveMember" :disabled="loading" :loading="loading" :title="t('save')" />
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-select
      @close="closePopUpSelectCompany"
      @save="selectCandidate"
      @search="getCandidates"
      v-if="showPopUpCompony"
      :items="candidates"
      searchable
      title="Выберите компании"
    />
  </teleport>
</template>

<style lang="scss" scoped>
  .member {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    // .member__header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
      border-bottom: 1px solid var(--input-background);
      position: sticky;
      z-index: 2;
      top: 0;
      background-color: var(--white);
    }
    // .member__header-left
    &__header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    // .member__header-right
    &__header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
    }
    // .member__title
    &__title {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: var(--black);
    }
    // .member__body
    &__body {
      border-bottom: 1px solid var(--input-background);
      flex: 1 1;
    }
    // .member__info
    &__info {
      padding: 20px 40px;
      border-bottom: 1px solid var(--input-background);
    }
    // .member__form
    &__form {
      padding: 20px 40px;
    }
    // .member__footer
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
    }
    // .member__footer-left
    &__footer-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    // .member__footer-right
    &__footer-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
    }
  }
</style>
