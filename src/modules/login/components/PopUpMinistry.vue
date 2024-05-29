<script setup lang="ts">
  import { ref } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['close', 'save'])

  const props = defineProps({
    item: { type: Object, default: null },
    loading: { type: Boolean, default: false }
  })

  const form = ref({})

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', form.value)
  }
  if (props.item) {
  }
</script>

<template>
  <pop-up-body @close="close" title="Добавить Министерство" width="500">
    <my-row>
      <my-col cols="12">
        <text-field label="Называния Министерство*" background required />
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" title="Отмена" outline />
        <my-button @click="save" title="Добавит" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped></style>
