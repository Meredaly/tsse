<script setup lang="ts">
  import { ref } from 'vue'
  import type { PropType } from 'vue'
  import { useI18n } from 'vue-i18n'

  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'

  const emit = defineEmits(['close', 'save', 'search'])

  interface Item {
    uuid: string
    name: string
  }
  const { t } = useI18n()

  defineProps({
    title: { type: String, default: '' },
    items: { type: Array as PropType<Item[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false }
  })

  const selectedItem = ref<Item | null>(null)
  const selectItem = (item: Item): void => {
    selectedItem.value = item
  }

  const searchText = ref<string>('')
  const searchInterval = ref<ReturnType<typeof setInterval> | null>(null)
  const search = (text: string) => {
    searchText.value = text
    searchInterval.value && clearTimeout(searchInterval.value)

    searchInterval.value = setTimeout(() => {
      emit('search', searchText.value)
    }, 500)
  }

  const close = () => {
    emit('close')
  }

  const save = () => {
    emit('save', selectedItem.value)
  }
</script>

<template>
  <pop-up-body @close="close" :title="title" width="500">
    <my-row>
      <my-col v-if="searchable" cols="12">
        <text-field @update-value="search" :value="searchText" prepend-icon="search" placeholder="Поиск" background />
      </my-col>
      <my-col cols="12">
        <div class="pop-up-select __custom-scroll">
          <div class="pop-up-select__items">
            <button
              v-for="item in items"
              :key="item.uuid"
              @click="selectItem(item)"
              :class="[
                'pop-up-select__item',
                {
                  _active: selectedItem?.uuid === item.uuid
                }
              ]"
            >
              <p>{{ item.name }}</p>
            </button>
          </div>
        </div>
      </my-col>
    </my-row>
    <template v-slot:bot>
      <div class="flex flex-x-end gap-20">
        <my-button @click="close" :title="t('cancel')" outline />
        <my-button @click="save" :title="t('save')" />
      </div>
    </template>
  </pop-up-body>
</template>

<style scoped lang="scss">
  .pop-up-select {
    height: 528px;
    overflow: auto;
    // .pop-up-select__items
    &__items {
    }
    // .pop-up-select__item
    &__item {
      display: block;
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      line-height: 16px;
      color: var(--black);
      padding: 14px 20px;
      background-color: var(--white);
      width: 100%;
      margin-bottom: 1px;
      text-align: left;
      &:hover {
        background-color: var(--hover-light);
      }
      &._active {
        background-color: var(--primary-500);
      }
    }
  }
</style>
