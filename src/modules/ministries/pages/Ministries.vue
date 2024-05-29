<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpMinistry from '../components/PopUpMinistry.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'
  import PopUpNotDeletable from '@/components/PopUpNotDeletable.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { more } from '@/helpers/menu'

  import { TableHeadItem } from '@/types/index'
  import { More } from '@/types/menu'
  import { Ministry } from '../types/index'

  import { GET_MINISTRIES, GET_MINISTRIES_COUNT, EDIT_MINISTRY, ADD_MINISTRY, REMOVE_MINISTRY } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'ministries.title' },
    { uuid: '2', sort: true, visibility: true, key: 'amountCompany', title: 'ministries.numberOfOrganization' }
  ])

  const ministries = ref<Ministry[]>([])

  const getMinistries = async (): Promise<void> => {
    try {
      const { data } = await GET_MINISTRIES({
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

      ministries.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getMinistries })

  sortKey.value = 'name'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_MINISTRIES_COUNT({
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
    getMinistries()
  }

  const getSearch = (): void => {
    page.value = 1
    getMinistries()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingMinistry = ref<boolean>(false)

  const saveMinistry = async (form: Ministry): Promise<void> => {
    try {
      loadingMinistry.value = true
      if (form.uuid) {
        await EDIT_MINISTRY({
          data: form
        })
      } else {
        await ADD_MINISTRY({
          data: { name: form.name }
        })
      }

      closePopUpMinistry()
      getMinistries()
    } catch (error) {
      console.error(error)
    } finally {
      loadingMinistry.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteMinistry = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await REMOVE_MINISTRY({
        params: {
          organizationUuid: selectedDeleteItem.value?.uuid
        }
      })
      getMinistries()
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

  const selectedDeleteItem = ref<Ministry | null>(null)
  const selectDeleteItem = (item: Ministry) => {
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

  const selectAction = (action: More, item: Ministry) => {
    if (action.id === 'EDIT') selectMinistry(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedMinistry = ref<Ministry | null>(null)
  const selectMinistry = (item: Ministry) => {
    selectedMinistry.value = item
    openPopUpMinistry()
  }

  const showPopUpMinistry = ref<boolean>(false)
  const openPopUpMinistry = (): void => {
    showPopUpMinistry.value = true
  }
  const closePopUpMinistry = (): void => {
    showPopUpMinistry.value = false

    selectedMinistry.value = null
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
    FILTER_NAME: 'ministries',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Ministry[]>([])
  const getAllMinistries = async (): Promise<void> => {
    try {
      const { data } = await GET_MINISTRIES({
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
      getAllMinistries()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Ministry) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, ministry: Ministry) => {
    if (status) {
      checkedItems.value.push(ministry)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Ministry) => item.uuid !== ministry.uuid)
    }
  }

  const exportToExcel = () => {
    const newTableHead = tableHead.value.map((head) => {
      return {
        ...head,
        title: t(head.title)
      }
    })
    tableToExcel({
      head: newTableHead,
      body: checkedItems.value,
      name: 'Министерство',
      fileName: 'Министерство.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpMinistry" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="ministry in ministries">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, ministry)" :status="getChecked(ministry.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectMinistry(ministry)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(ministry, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, ministry)" :items="moreMenu" />
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
    <pop-up-ministry @save="saveMinistry" @close="closePopUpMinistry" :item="selectedMinistry" :loading="loadingMinistry" v-if="showPopUpMinistry" />
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteMinistry"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
