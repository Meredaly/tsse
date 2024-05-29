<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PropType } from 'vue'

  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Dropdown from '@/UI/Dropdown.vue'

  import { useValidators } from '@/helpers/validators'

  import { User, UserData, Item } from '../types'

  import { GET_USER, GET_JOB_TITLES_KEY } from '../api'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<User | null>, default: null },
    loading: { type: Boolean, default: false },
    error: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required } = useValidators()

  const form = ref<UserData>({
    name: '',
    surname: '',
    patronomicName: '',
    email: '',
    password: '',
    roleUuid: ''
  })

  const getUser = async (): Promise<void> => {
    try {
      const { data } = await GET_USER({
        params: {
          userUuid: props.item?.uuid
        }
      })
      form.value = {
        uuid: data.uuid,
        name: data.name,
        surname: data.surname,
        patronomicName: data.patronomicName,
        email: data.email,
        password: '',
        roleUuid: data.roleDTO.uuid
      }
      selectRole(data.roleDTO)
    } catch (error) {
      console.error(error)
    }
  }

  const roles = ref<Item[]>([])
  const getRoles = async (text: string = ''): Promise<void> => {
    try {
      const { data } = await GET_JOB_TITLES_KEY({
        params: {
          searchKey: text
        }
      })

      roles.value = data.filter((role: Item) => role.name !== 'Admin')
    } catch (error) {
      console.error(error)
    }
  }
  getRoles()

  const selectedRole = ref<Item | null>(null)
  const selectRole = (role: Item) => {
    selectedRole.value = role

    form.value.roleUuid = role.uuid
  }

  const isPassword = ref(true)

  const close = () => {
    emit('close')
  }

  const error = ref<boolean>(false)
  const save = (): void => {
    if (checkValidation()) {
      emit('save', form.value)
    }
  }

  if (props.item) {
    getUser()
  }

  const checkValidation = () => {
    if (required(form.value.name) && required(form.value.surname) && required(form.value.roleUuid) && required(form.value.email)) {
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
  <pop-up-body @close="close" :title="props.item ? t('userSettings.editUser') : t('userSettings.newUser')" width="700">
    <my-row>
      <my-col cols="6">
        <text-field
          v-model.trim="form.surname"
          :error="error && !form.surname"
          :label="t('userSettings.surname')"
          :disabled="loading"
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field v-model.trim="form.name" :error="error && !form.name" :label="t('userSettings.name')" :disabled="loading" background required />
      </my-col>
      <my-col cols="6">
        <text-field v-model.trim="form.patronomicName" :label="t('userSettings.fullName')" :disabled="loading" background />
      </my-col>
      <my-col cols="6">
        <dropdown
          @select-item="selectRole"
          :selected-item="selectedRole"
          :items="roles"
          :error="error && !form.roleUuid"
          @search="getRoles"
          searchable
          :label="t('userSettings.jobTitle')"
          :disabled="loading"
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.email"
          :error="(error && !form.email) || props.error"
          :label="t('userSettings.login')"
          :disabled="loading"
          background
          required
        />
      </my-col>
      <my-col cols="6">
        <text-field
          v-model.trim="form.password"
          @click:append="isPassword = !isPassword"
          :appendIcon="isPassword ? 'eye' : 'eyeOff'"
          :type="isPassword ? 'password' : 'text'"
          :disabled="loading"
          :label="t('userSettings.password')"
          background
          clickable-append
        />
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
