<script setup lang="ts">
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['close', 'save'])

  defineProps({
    title: { type: String, default: '' },
    loading: { type: Boolean, default: false }
  })

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save')
  }
</script>

<template>
  <pop-up-body @close="close" :title="title" width="500">
    <template v-slot:bot>
      <div class="flex flex-x-center gap-20">
        <my-button @click="close" :disabled="loading" title="Отмена" outline />
        <my-button @click="save" :disabled="loading" :loading="loading" title="Удалить" styles="danger" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss"></style>
