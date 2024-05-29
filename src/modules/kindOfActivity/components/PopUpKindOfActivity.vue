<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  import { useValidators } from '@/helpers/validators'

  import { KindOfActivity } from '../types'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object as PropType<KindOfActivity | null>, default: null },
    loading: { type: Boolean, default: false }
  })

  const { t } = useI18n()
  const { required } = useValidators()

  const form = ref<KindOfActivity>({
    uuid: '',
    name: ''
  })

  const close = (): void => {
    emit('close')
  }

  const error = ref<boolean>(false)
  const save = (): void => {
    if (checkValidation()) {
      emit('save', form.value)
    }
  }

  if (props.item) {
    form.value = {
      uuid: props.item.uuid,
      name: props.item.name
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
  <pop-up-body @close="close" :title="form.uuid ? t('kindOfActivity.saveKindOfActivity') : t('kindOfActivity.addKindOfActivity')" width="500">
    <my-row>
      <my-col cols="12">
        <text-field v-model.trim="form.name" :disabled="loading" :error="error" :label="t('kindOfActivity.kindOfActivity')" background required />
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

<style scoped></style>
