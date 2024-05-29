<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpCountry from '../components/PopUpCountry.vue'
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
  import { Country } from '../types/index'

  import { GET_COUNTRIES, GET_COUNTRIES_COUNT, ADD_COUNTRY, EDIT_COUNTRY, DELETE_COUNTRY } from '../api/country'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(10)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'localization.title' },
    { uuid: '2', sort: true, visibility: true, key: 'amountCompany', title: 'localization.numberOfOrganization' }
  ])

  const countries = ref<Country[]>([])

  const getCountries = async (): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES({
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

      countries.value = data || []
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getCountries })

  sortKey.value = 'name'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES_COUNT({
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
    getCountries()
  }
  const getSearch = (): void => {
    page.value = 1
    getCountries()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingCountry = ref<boolean>(false)

  const saveCountry = async (form: Country): Promise<void> => {
    try {
      loadingCountry.value = true
      if (form.uuid) {
        await EDIT_COUNTRY({
          data: form
        })
      } else {
        await ADD_COUNTRY({
          data: { name: form.name }
        })
      }

      closePopUpCountry()
      getCountries()
    } catch (error) {
      console.error(error)
    } finally {
      loadingCountry.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteCountry = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_COUNTRY({
        params: {
          countryUuid: selectedDeleteItem.value?.uuid
        }
      })
      getCountries()
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

  const selectedDeleteItem = ref<Country | null>(null)
  const selectDeleteItem = (item: Country) => {
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

  const selectAction = (action: More, item: Country) => {
    if (action.id === 'EDIT') selectCountry(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedCountry = ref<Country | null>(null)
  const selectCountry = (item: Country) => {
    selectedCountry.value = item
    openPopUpCountry()
  }

  const showPopUpCountry = ref<boolean>(false)
  const openPopUpCountry = (): void => {
    showPopUpCountry.value = true
  }
  const closePopUpCountry = (): void => {
    showPopUpCountry.value = false

    selectedCountry.value = null
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
    FILTER_NAME: 'localizationCountry',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Country[]>([])
  const getAllCountries = async (): Promise<void> => {
    try {
      const { data } = await GET_COUNTRIES({
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
      getAllCountries()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Country) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, country: Country) => {
    if (status) {
      checkedItems.value.push(country)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Country) => item.uuid !== country.uuid)
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
      name: 'Страна',
      fileName: 'Страна.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpCountry" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="country in countries">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, country)" :status="getChecked(country.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectCountry(country)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(country, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action: More) => selectAction(action, country)" :items="moreMenu" />
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
    <pop-up-country @save="saveCountry" @close="closePopUpCountry" :item="selectedCountry" :loading="loadingCountry" v-if="showPopUpCountry" />
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteCountry"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
