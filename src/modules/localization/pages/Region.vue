<script setup lang="ts">
  import { ref } from 'vue'

  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpRegion from '../components/PopUpRegion.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'
  import PopUpNotDeletable from '@/components/PopUpNotDeletable.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'

  import { more } from '@/helpers/menu'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { TableHeadItem } from '@/types/index'
  import { More } from '@/types/menu'
  import { Region } from '../types/index'

  import { GET_REGIONS, GET_REGIONS_COUNT, ADD_REGION, EDIT_REGION, DELETE_REGION } from '../api/region'
  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(10)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'localization.region' },
    { uuid: '2', sort: true, visibility: true, key: 'countryName', title: 'localization.country' },
    {
      uuid: '3',
      sort: true,
      visibility: true,
      key: 'amountCompany',
      title: 'localization.numberOfCompaniesAndOrganizations'
    }
  ])

  const regions = ref<Region[]>([])

  const getRegions = async (): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
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

      regions.value = data.map((region: Region) => {
        return {
          ...region,
          countryName: region.countryDTO?.name || ''
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getRegions })

  sortKey.value = 'name'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_REGIONS_COUNT({
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
    getRegions()
  }

  const getSearch = (): void => {
    page.value = 1
    getRegions()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingRegion = ref<boolean>(false)

  const saveRegion = async (form: Region): Promise<void> => {
    try {
      loadingRegion.value = true
      if (form.uuid) {
        await EDIT_REGION({
          params: {
            countryUuid: form.countryDTO?.uuid || null
          },
          data: {
            uuid: form.uuid,
            name: form.name
          }
        })
      } else {
        await ADD_REGION({
          params: {
            countryUuid: form.countryDTO?.uuid || null
          },
          data: { name: form.name }
        })
      }

      closePopUpRegion()
      getRegions()
    } catch (error) {
      console.error(error)
    } finally {
      loadingRegion.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteRegion = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_REGION({
        params: {
          regionUuid: selectedDeleteItem.value?.uuid
        }
      })

      getRegions()
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

  const selectedDeleteItem = ref<Region | null>(null)
  const selectDeleteItem = (item: Region) => {
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

  const selectAction = (action: More, item: Region) => {
    if (action.id === 'EDIT') selectRegion(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedRegion = ref<Region | null>(null)
  const selectRegion = (item: Region) => {
    selectedRegion.value = item
    openPopUpRegion()
  }

  const showPopUpRegion = ref<boolean>(false)
  const openPopUpRegion = (): void => {
    showPopUpRegion.value = true
  }
  const closePopUpRegion = (): void => {
    showPopUpRegion.value = false

    selectedRegion.value = null
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
    FILTER_NAME: 'localizationRegion',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Region[]>([])
  const getAllRegions = async (): Promise<void> => {
    try {
      const { data } = await GET_REGIONS({
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
      getAllRegions()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Region) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, region: Region) => {
    if (status) {
      checkedItems.value.push(region)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Region) => item.uuid !== region.uuid)
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
      name: 'Регион',
      fileName: 'Регион.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpRegion" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="region in regions">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, region)" :status="getChecked(region.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectRegion(region)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(region, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, region)" :items="moreMenu" />
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
    <pop-up-region @save="saveRegion" @close="closePopUpRegion" :item="selectedRegion" :loading="loadingRegion" v-if="showPopUpRegion" />
    <pop-up-select-checkbox
      @close="closeFilter"
      @save="saveFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteRegion"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
