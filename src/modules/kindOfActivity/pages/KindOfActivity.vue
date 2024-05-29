<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpKindOfActivity from '../components/PopUpKindOfActivity.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'
  import PopUpNotDeletable from '@/components/PopUpNotDeletable.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'

  import { more } from '@/helpers/menu'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { More } from '@/types/menu'
  import { TableHeadItem } from '@/types/index'
  import { KindOfActivity } from '../types/index'

  import { GET_KIND_OF_ACTIVITIES, GET_KIND_OF_ACTIVITIES_COUNT, ADD_KIND_OF_ACTIVITY, EDIT_KIND_OF_ACTIVITY, REMOVE_KIND_OF_ACTIVITY } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'kindOfActivity.kindOfActivity' },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'amountCompany',
      title: 'kindOfActivity.numberOfCompaniesAndOrganizations'
    }
  ])

  const kindOfActivities = ref<KindOfActivity[]>([])

  const getKindOfActivities = async (): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES({
        params: {
          page: page.value - 1,
          size: limit.value
        },
        data: {
          searchKey: searchText.value,
          sort: [
            {
              sortBy: sortKey.value,
              sortType: sortType.value ? 'ASCENDING' : 'DESCENDING'
            }
          ]
        }
      })

      kindOfActivities.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getKindOfActivities })

  sortKey.value = 'name'

  const loadingKindOfActivity = ref<boolean>(false)

  const saveKindOfActivity = async (form: KindOfActivity): Promise<void> => {
    try {
      loadingKindOfActivity.value = true
      if (form.uuid) {
        await EDIT_KIND_OF_ACTIVITY({
          data: form
        })
      } else {
        await ADD_KIND_OF_ACTIVITY({
          data: { name: form.name }
        })
      }

      closePopUpKindOfActivity()
      getKindOfActivities()
      pagesCount()
    } catch (error) {
      console.error(error)
    } finally {
      loadingKindOfActivity.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteKindOfActivity = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await REMOVE_KIND_OF_ACTIVITY({
        params: {
          activityUuid: selectedDeleteItem.value?.uuid
        }
      })
      getKindOfActivities()
      pagesCount()
      closePopUpConfirmDelete()
    } catch (error: any) {
      console.error(error)
      if (error.response.status === 417) {
        closePopUpConfirmDelete()
        openPopUpShowNotDeletable()
      }
    } finally {
      loadingDelete.value = false
    }
  }

  const selectedDeleteItem = ref<KindOfActivity | null>(null)
  const selectDeleteItem = (item: KindOfActivity) => {
    selectedDeleteItem.value = item
    openPopUpConfirmDelete()
  }

  const showPopUpConfirmDelete = ref<boolean>(false)
  const openPopUpConfirmDelete = () => {
    showPopUpConfirmDelete.value = true
  }
  const closePopUpConfirmDelete = () => {
    showPopUpConfirmDelete.value = false
  }

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES_COUNT({
        params: {
          searchKey: searchText.value
        }
      })

      pages.value = Math.ceil(data / limit.value)
      count.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    getKindOfActivities()
  }

  const getSearch = (): void => {
    page.value = 1
    getKindOfActivities()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: KindOfActivity) => {
    if (action.id === 'EDIT') selectKindOfActivity(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedKindOfActivity = ref<KindOfActivity | null>(null)
  const selectKindOfActivity = (item: KindOfActivity) => {
    selectedKindOfActivity.value = item
    openPopUpKindOfActivity()
  }

  const showPopUpKindOfActivity = ref<boolean>(false)
  const openPopUpKindOfActivity = (): void => {
    showPopUpKindOfActivity.value = true
  }

  const closePopUpKindOfActivity = (): void => {
    showPopUpKindOfActivity.value = false

    selectedKindOfActivity.value = null
  }

  const showNotDeletable = ref<boolean>(false)
  const openPopUpShowNotDeletable = () => {
    showNotDeletable.value = true
  }
  const closePopUpShowNotDeletable = () => {
    showNotDeletable.value = false
  }

  const { startData, endData } = useDataCounts({ page, limit, count })

  const { getFilters, closeFilter, openFilter, saveFilter, selectedFilters, filterItems, showFilter } = useFilters({
    FILTER_NAME: 'kindOfActivity',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<KindOfActivity[]>([])
  const getALLKindOfActivities = async (): Promise<void> => {
    try {
      const { data } = await GET_KIND_OF_ACTIVITIES({
        params: {
          page: page.value - 1,
          size: count.value
        },
        data: {
          searchKey: searchText.value,
          sort: [
            {
              sortBy: sortKey.value,
              sortType: sortType.value ? 'ASCENDING' : 'DESCENDING'
            }
          ]
        }
      })
      checkedItems.value = data
    } catch (error) {
      console.error(error)
    }
  }
  const checkAll = (): void => {
    if (checkedItems.value.length === count.value) {
      checkedItems.value = []
    } else {
      getALLKindOfActivities()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: KindOfActivity) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, kindOfActivity: KindOfActivity) => {
    if (status) {
      checkedItems.value.push(kindOfActivity)
    } else {
      checkedItems.value = checkedItems.value.filter((item: KindOfActivity) => item.uuid !== kindOfActivity.uuid)
    }
  }

  const exportToExcel = () => {
    const newTableHead = tableHead.value.map((head) => {
      return {
        ...head,
        title: t(head.title)
      }
    })
    tableToExcel({ head: newTableHead, body: checkedItems.value, name: 'Вид деятельности', fileName: 'Вид деятельности.xls' })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpKindOfActivity" :title="t('add')" append-icon="addCircle" />
        <my-button
          @click="exportToExcel"
          :disabled="!checkedItems.length"
          :styles="checkedItems.length ? 'primary' : 'secondary'"
          :outline="!!checkedItems.length"
          :title="t('export')"
          append-icon="arrowUpload"
        />
      </div>
      <div class="main__header-right">
        <text-field @update-value="search" :value="searchText" :placeholder="t('search')" prependIcon="search" width="360" />
        <my-button @click="openFilter" append-icon="filter" only-icon />
      </div>
    </div>
    <div class="main__body __custom-scroll">
      <div class="main-table">
        <table>
          <thead>
            <tr>
              <th width="1">
                <div>
                  <my-checkbox @update-status="checkAll" :status="checkedItems.length === count && count !== 0" />
                </div>
              </th>
              <template v-for="head in tableHead">
                <th v-if="head.visibility">
                  <div @click="tableFilter(head.key, head.sort)" class="main-table__head-filter">
                    <p>{{ t(head.title) }}</p>
                    <icon v-if="head.sort && head.key == sortKey" :name="sortType ? 'chevronBottom' : 'chevronTop'" />
                  </div>
                </th>
              </template>
              <th width="1">
                <div class="main-table__head-filter">
                  <icon name="moreVertical" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="kindOfActivity in kindOfActivities">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, kindOfActivity)" :status="getChecked(kindOfActivity.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectKindOfActivity(kindOfActivity)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(kindOfActivity, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, kindOfActivity)" :items="moreMenu" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="main__footer">
      <div class="main__footer-left">
        <div class="main__footer-pagination-count">
          {{ t('shown') }} {{ t('from') }} {{ startData }} {{ t('to') }} {{ endData }} {{ t('in') }} {{ count }}
        </div>
      </div>
      <div class="main__footer-right">
        <pagination @click-page="updatePage" v-model="page" :page-count="pages" />
      </div>
    </div>
  </div>
  <teleport to="#pop-up">
    <pop-up-kind-of-activity
      @save="saveKindOfActivity"
      @close="closePopUpKindOfActivity"
      :item="selectedKindOfActivity"
      :loading="loadingKindOfActivity"
      v-if="showPopUpKindOfActivity"
    />
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteKindOfActivity"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
