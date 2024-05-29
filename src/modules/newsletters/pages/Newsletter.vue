<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import MyButton from '@/UI/MyButton.vue'
  import TextField from '@/UI/TextField.vue'
  import TextArea from '@/UI/TextArea.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import FileUploader from '@/UI/FileUploader.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'

  import { fileUploader } from '@/composables/fileUploader'

  import { Item } from '../types'

  import { GET_KIND_OF_ACTIVITIES, GET_COMPANIES, SEND_MAIL } from '../api'

  const { t } = useI18n()
  const router = useRouter()

  const form = ref({
    name: '',
    text: '',
    fileUuid: '',
    entrepreneurUuids: '',
    companyUuids: ''
  })

  const { fileData, uploadFile, openFile } = fileUploader()

  const formTypes = ref([
    { uuid: 'EMAIL', name: 'E-MAIL' },
    { uuid: 'SMS', name: 'SMS' }
  ])

  const kindOfActivities = ref<Item[]>([])
  const getKindOfActivities = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES({
        params: {
          searchKey: text
        }
      })
      kindOfActivities.value = data
    } catch (error) {
      console.error(error)
    }
  }
  getKindOfActivities()

  const selectedKindOfActivities = ref<Item[]>([])
  const selectKindOfActivity = (selectedItems: Item[]): void => {
    selectedKindOfActivities.value = selectedItems
    getCompanies()
    closePopUpSelectKindOfActivity()
  }

  const companies = ref<Item[]>([])
  const getCompanies = async (text: string = ''): Promise<void> => {
    const typeActivityUuids = selectedKindOfActivities.value.map((activity: Item) => activity.uuid).join(', ') || ''
    try {
      const { data } = await GET_COMPANIES({
        params: {
          searchKey: text
        },
        data: {
          typeActivityUuids: typeActivityUuids
        }
      })
      companies.value = data.map((company: Item) => {
        return {
          ...company,
          name: `${company.recipientName} (${t(company.memberType)})`
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  getCompanies()

  const selectedCompanies = ref<Item[]>([])
  const selectCompanies = (selectedItems: Item[]): void => {
    selectedCompanies.value = selectedItems
    form.value.companyUuids = selectedItems
      .filter((item) => item.memberType === 'IS_COMPANY')
      .map((item) => item.uuid)
      .join(',')
    form.value.entrepreneurUuids = selectedItems
      .filter((item) => item.memberType === 'IS_ENTREPRENEUR')
      .map((item) => item.uuid)
      .join(',')
    closePopUpSelectCompony()
  }

  const showPopUpSelectKindOfActivity = ref<boolean>(false)
  const openPopUpSelectKindOfActivity = (): void => {
    showPopUpSelectKindOfActivity.value = true
  }
  const closePopUpSelectKindOfActivity = (): void => {
    showPopUpSelectKindOfActivity.value = false
  }

  const showPopUpSelectCompony = ref<boolean>(false)
  const openPopUpSelectCompony = (): void => {
    showPopUpSelectCompony.value = true
  }
  const closePopUpSelectCompony = (): void => {
    showPopUpSelectCompony.value = false
  }

  const showPopUpType = ref<boolean>(false)
  const openPopUpType = (): void => {
    showPopUpType.value = true
  }
  const closePopUpType = (): void => {
    showPopUpType.value = false
  }

  const isEmailSelect = ref(true)
  const selectedTypes = ref<Item[]>([formTypes.value[0]])
  const selectTypes = (items: Item[]) => {
    selectedTypes.value = items
    isEmailSelect.value = items.some((item: Item) => item.uuid === 'EMAIL')
    closePopUpType()
  }

  const back = (): void => {
    router.push('/newsletters')
  }

  const kindOfActivitiesName = computed(() => {
    return selectedKindOfActivities.value.map((kindOfActivity: Item) => kindOfActivity.name).join(', ')
  })
  const companiesName = computed(() => {
    return selectedCompanies.value.map((company: Item) => company.name).join(', ')
  })
  const typeName = computed(() => {
    return selectedTypes.value.map((type: Item) => type.name).join(', ')
  })

  const loading = ref<boolean>(false)
  const sendForm = async (): Promise<void> => {
    loading.value = true
    try {
      form.value.fileUuid = fileData.value.uuid
      const isSelectEmail = selectedTypes.value.some((item: Item) => item.uuid === 'EMAIL')

      if (isSelectEmail) {
        await SEND_MAIL({
          data: {
            ...form.value,
            typeMailing: 'EMAIL'
          }
        })
      }

      back()
    } catch (error) {
      console.error(error)
      loading.value = false
    }
  }
</script>

<template>
  <div class="newsletter __custom-scroll __box">
    <div class="newsletter__header">
      <div class="newsletter__header-left">
        <my-button @click="back" :title="t('newsletters.back')" outline prev-icon="arrowLeft" />
      </div>
      <div class="newsletter__header-right">
        <div class="newsletter__title">{{ t('newsletters.newsletters') }}</div>
      </div>
    </div>
    <div class="newsletter__body">
      <div class="newsletter__sub-title">{{ t('newsletters.chooseTheOptionsYouWant') }}</div>
      <div class="newsletter__form">
        <my-row>
          <my-col cols="6">
            <text-field
              @click:input="openPopUpSelectKindOfActivity"
              :value="kindOfActivitiesName"
              :disabled="loading"
              :label="t('newsletters.kindOfActivity')"
              :placeholder="t('newsletters.choose')"
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              @click:input="openPopUpSelectCompony"
              :value="companiesName"
              :disabled="loading"
              :label="t('newsletters.selectCompanies')"
              :placeholder="t('newsletters.choose')"
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="typeName"
              disabled
              :label="t('newsletters.sendForm')"
              :placeholder="t('newsletters.choose')"
            />
          </my-col>
          <my-col v-if="false" cols="6">
            <text-field
              @click:input="openPopUpType"
              :value="typeName"
              :disabled="loading"
              :label="t('newsletters.sendForm')"
              :placeholder="t('newsletters.choose')"
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              v-model.trim="form.name"
              :disabled="loading"
              :label="t('newsletters.nameExhibition')"
              :placeholder="t('newsletters.enterText')"
            />
          </my-col>
          <my-col cols="12">
            <text-area
              v-model="form.text"
              :disabled="loading"
              :label="t('newsletters.writeText')"
              :placeholder="t('newsletters.text')"
              class="newsletter__textarea"
            />
          </my-col>
          <my-col cols="6">
            <file-uploader
              @change-file="uploadFile"
              @open-file="openFile"
              :show="fileData.path"
              :disabled="loading || !isEmailSelect"
              :value="fileData.name"
              :progress="fileData.progress"
              :label="t('newsletters.attachFile')"
              :placeholder="t('newsletters.selectFile')"
              :message="t('newsletters.attachFileMessage')"
            />
          </my-col>
        </my-row>
      </div>
    </div>
    <div class="newsletter__footer">
      <div class="newsletter__footer-left"></div>
      <div class="newsletter__footer-right">
        <my-button @click="sendForm" :loading="loading" :disabled="loading" :title="t('newsletters.send')" />
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-select-checkbox
      @close="closePopUpSelectKindOfActivity"
      @search="getKindOfActivities"
      @save="selectKindOfActivity"
      :selected-items="selectedKindOfActivities"
      :items="kindOfActivities"
      v-if="showPopUpSelectKindOfActivity"
      searchable
      :title="t('newsletters.selectActivities')"
    />
    <pop-up-select-checkbox
      @close="closePopUpSelectCompony"
      @search="getCompanies"
      @save="selectCompanies"
      :selected-items="selectedCompanies"
      :items="companies"
      v-if="showPopUpSelectCompony"
      searchable
      :title="t('newsletters.selectCompanies')"
    />
    <pop-up-select-checkbox
      @close="closePopUpType"
      @save="selectTypes"
      :selected-items="selectedTypes"
      :items="formTypes"
      v-if="showPopUpType"
      :title="t('newsletters.sendForm')"
    />
  </teleport>
</template>

<style scoped lang="scss">
  .newsletter {
    height: 100%;
    overflow: auto;
    display: flex;
    flex-direction: column;
    // .newsletter__header
    &__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
      border-bottom: 1px solid var(--input-background);
    }
    // .newsletter__header-left
    &__header-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    // .newsletter__header-right
    &__header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
    }
    // .newsletter__title
    &__title {
      font-weight: 600;
      font-size: 24px;
      line-height: 28px;
      color: var(--black);
    }
    // .newsletter__body
    &__body {
      border-bottom: 1px solid var(--input-background);
      flex: 1 1;
      padding: 20px 40px;
    }
    // .newsletter__sub-title
    &__sub-title {
      font-weight: 500;
      font-size: 24px;
      line-height: 28px;
      color: var(--black);
      margin-bottom: 40px;
    }
    // .newsletter__form
    &__form {
    }
    // .newsletter__footer
    &__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 40px;
    }
    // .newsletter__footer-left
    &__footer-left {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      gap: 15px;
    }
    // .newsletter__footer-right
    &__footer-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 15px;
    }
    // .newsletter__textarea
    &__textarea {
      &:deep() {
        textarea {
          height: 316px;
        }
      }
    }
  }
</style>
