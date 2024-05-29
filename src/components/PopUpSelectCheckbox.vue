<script setup lang="ts">
  import { ref, watchEffect } from 'vue'
  import { useI18n } from 'vue-i18n'

  import type { PropType } from 'vue'
  import PopUpBody from '@/components/PopUpBody.vue'
  import MyRow from '@/UI/MyRow.vue'
  import MyCol from '@/UI/MyCol.vue'
  import TextField from '@/UI/TextField.vue'
  import MyButton from '@/UI/MyButton.vue'
  import Icon from '@/UI/Icon'

  import { SelectCheckboxItem } from '@/types'

  const { t } = useI18n()

  const emit = defineEmits(['close', 'save', 'search'])

  const props = defineProps({
    title: { type: String, default: '' },
    items: { type: Array as PropType<SelectCheckboxItem[]>, default: () => [] },
    selectedItems: { type: Array as PropType<SelectCheckboxItem[]>, default: () => [] },
    loading: { type: Boolean, default: false },
    searchable: { type: Boolean, default: false }
  })

  const checkedSelectedItems = ref<SelectCheckboxItem[]>([])
  watchEffect(() => {
    checkedSelectedItems.value = JSON.parse(JSON.stringify(props.selectedItems))
  })

  const selectItem = (item: SelectCheckboxItem) => {
    if (isChecked(item)) {
      isSelectAll.value = false
      checkedSelectedItems.value = checkedSelectedItems.value.filter(
        (selectedCheckboxItem) => selectedCheckboxItem.uuid !== item.uuid
      )
    } else {
      checkedSelectedItems.value.push(item)
    }
  }

  const isChecked = (item: SelectCheckboxItem): boolean => {
    return checkedSelectedItems.value.some((selectedCheckboxItem) => selectedCheckboxItem.uuid === item.uuid)
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
    emit('save', checkedSelectedItems.value)
  }

  const isSelectAll = ref(false)
  const selectAll = () => {
    isSelectAll.value = !isSelectAll.value
    if (isSelectAll.value) {
      checkedSelectedItems.value = props.items
    } else {
      checkedSelectedItems.value = []
    }
  }
</script>

<template>
  <pop-up-body @close="close" :title="title" width="500">
    <my-row>
      <my-col v-if="searchable" cols="12">
        <text-field @update-value="search" :value="searchText" placeholder="Поиск" background />
      </my-col>
      <my-col cols="12">
        <div class="pop-up-select __custom-scroll">
          <div class="pop-up-select__items">
            <button @click="selectAll" :class="['pop-up-select__item', { _active: isSelectAll }]">
              <div class="pop-up-select__check">
                <icon :name="isSelectAll ? 'checked' : 'unchecked'" />
              </div>
              <p>{{ t('selectAll') }}</p>
            </button>
          </div>
          <div class="pop-up-select__items">
            <button
              v-for="item in items"
              :key="item.uuid"
              @click="selectItem(item)"
              :class="['pop-up-select__item', { _active: isChecked(item) }]"
            >
              <div class="pop-up-select__check">
                <icon :name="isChecked(item) ? 'checked' : 'unchecked'" />
              </div>
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
      cursor: pointer;
      display: flex;
      align-items: center;
      &:hover {
        background-color: var(--hover-light);
      }
      &._active {
        .pop-up-select__check {
          color: var(--primary);
        }
      }
    }
    // .pop-up-select__check
    &__check {
      margin-right: 10px;
    }
  }
</style>
