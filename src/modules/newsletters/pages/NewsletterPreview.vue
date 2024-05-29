<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter, useRoute } from 'vue-router'

  import MyButton from '@/UI/MyButton.vue'
  import TextField from '@/UI/TextField.vue'
  import TextArea from '@/UI/TextArea.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import FileUploader from '@/UI/FileUploader.vue'

  import { fileUploader } from '@/composables/fileUploader'

  import { GET_NEWSLETTER } from '../api'
  import { Item } from '../types'

  const { t } = useI18n()
  const router = useRouter()
  const route = useRoute()

  const form = ref({
    name: '',
    text: '',
    mailingType: '',
    kindOfActivities: '',
    companyNames: ''
  })

  const { fileData, openFile } = fileUploader()

  const getNewsletter = async (): Promise<void> => {
    try {
      const { data } = await GET_NEWSLETTER({ params: { mailingUuid: route.params.id } })
      const companyNames = data.companyDTOS.map((company: Item) => company.name)
      const entrepreneurNames = data.entrepreneurDTOS?.map((entrepreneur: any) => entrepreneur.personDTO.personDTOFullName)
      const activities = [] as string[]
      data.companyDTOS.forEach((company: any) => {
        company.typeActivityDTOS.forEach((activity: any) => {
          if (!activities.includes(activity.name)) {
            activities.push(activity.name)
          }
        })
      })
      data.entrepreneurDTOS.forEach((entrepreneur: any) => {
        entrepreneur.typeActivityDTOS.forEach((activity: any) => {
          if (!activities.includes(activity.name)) {
            activities.push(activity.name)
          }
        })
      })

      form.value = {
        name: data.name,
        text: data.text,
        mailingType: data.typeMailing,
        kindOfActivities: activities.join(', '),
        companyNames: [...companyNames, ...entrepreneurNames].join(', ')
      }
      if (data.fileDTO) {
        fileData.value = {
          uuid: data.fileDTO.uuid,
          name: data.fileDTO.name,
          path: data.fileDTO.path,
          progress: 0
        }
      }
    } catch (error) {
      console.error(error)
    }
  }
  getNewsletter()

  const back = (): void => {
    router.push('/newsletters')
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
      <div class="newsletter__form">
        <my-row>
          <my-col cols="6">
            <text-field
              :value="form.kindOfActivities"
              disabled
              :label="t('newsletters.kindOfActivity')"
              :placeholder="t('newsletters.choose')"
              required
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="form.companyNames"
              disabled
              :label="t('newsletters.selectCompanies')"
              :placeholder="t('newsletters.choose')"
              required
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              :value="form.mailingType"
              disabled
              :label="t('newsletters.sendForm')"
              :placeholder="t('newsletters.choose')"
              required
              type="button"
              append-icon="chevronBottom"
            />
          </my-col>
          <my-col cols="6">
            <text-field
              v-model.trim="form.name"
              disabled
              :label="t('newsletters.nameExhibition')"
              :placeholder="t('newsletters.enterText')"
              required
            />
          </my-col>
          <my-col cols="12">
            <text-area
              v-model="form.text"
              disabled
              :label="t('newsletters.writeText')"
              :placeholder="t('newsletters.text')"
              required
              class="newsletter__textarea"
            />
          </my-col>
          <my-col cols="6">
            <file-uploader
              @open-file="openFile"
              :show="fileData.path"
              disabled
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
  </div>
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
