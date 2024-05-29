<script setup lang="ts">
  import { ref } from 'vue'
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Icon from '@/UI/Icon'

  import { useValidators } from '@/helpers/validators'

  import { JobTitleData, JobTitle, Item } from '../types'

  import { GET_JOB_CATEGORIES, GET_JOB_TITLE } from '../api'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<JobTitle | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required } = useValidators()

  const form = ref<JobTitleData>({
    name: '',
    categoryUuids: '',
    privilages: ''
  })

  const privileges = ref<boolean[]>([])
  const jobCategories = ref<Item[]>([])
  const getJobCategories = async (): Promise<void> => {
    try {
      const { data } = await GET_JOB_CATEGORIES()
      jobCategories.value = data
      form.value.categoryUuids = data.map((category: Item) => category.uuid).join(', ')
      data.forEach(() => privileges.value.push(false))
    } catch (error) {
      console.error(error)
    }

    if (props.item) {
      getJobTitle()
    }
  }
  getJobCategories()

  const getJobTitle = async (): Promise<void> => {
    try {
      const { data } = await GET_JOB_TITLE({
        params: {
          roleUuid: props.item?.uuid
        }
      })
      form.value.uuid = data.uuid
      form.value.name = data.name

      data.roleCategoryDTOS.forEach((category: any) => {
        jobCategories.value.forEach((jobCategory: Item, index: number): void => {
          if (category.categoryDTO.uuid === jobCategory.uuid) {
            privileges.value[index] = category.privilage
          }
        })
      })
    } catch (error) {
      console.error(error)
    }
  }

  const updatePrivilege = (index: number): void => {
    privileges.value[index] = !privileges.value[index]
  }

  const close = () => {
    emit('close')
  }
  const error = ref<boolean>(false)
  const save = () => {
    form.value.privilages = privileges.value.join(', ')
    if (checkValidation()) {
      emit('save', form.value)
    }
  }

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
  <pop-up-body @close="close" :title="t('userSettings.jobTitle')" width="650">
    <my-row>
      <my-col cols="12">
        <text-field v-model="form.name" :disabled="loading" :error="error" :label="t('userSettings.jobTitle')" background required />
      </my-col>
      <my-col v-for="(jobCategory, index) in jobCategories" cols="6">
        <button @click="updatePrivilege(index)" :class="['job-title-checkbox__item', { _active: privileges[index] }]">
          <icon :name="privileges[index] ? 'checked' : 'unchecked'" />
          <p>{{ jobCategory.name }}</p>
        </button>
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

<style lang="scss" scoped>
  .job-title-checkbox {
    height: 100%;
    width: 100%;
    // .job-title-checkbox__item
    &__item {
      width: 100%;
      display: flex;
      align-self: center;
      padding: 10px 20px;
      gap: 10px;
      background: #f8f8f8;
      p {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
        color: var(--black);
        text-align: left;
      }
      &._active {
        span {
          color: var(--primary);
        }
      }
    }
  }
</style>
