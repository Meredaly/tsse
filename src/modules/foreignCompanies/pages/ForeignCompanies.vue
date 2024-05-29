<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpForeignCompany from '../components/PopUpForeignCompany.vue'
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
  import { Item, ForeignCompany, Person } from '../types/index'

  import {
    ADD_FOREIGN_COMPANY,
    DELETE_FOREIGN_COMPANY,
    EDIT_FOREIGN_COMPANY,
    GET_FOREIGN_COMPANIES,
    GET_FOREIGN_COMPANIES_COUNT,
    GET_FOREIGN_COMPANY
  } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const loadingForeignCompanies = ref<boolean>(false)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'foreignCompanies.nameCompany' },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'typeActivityName',
      title: 'foreignCompanies.kindOfActivity'
    },
    {
      uuid: '3',
      sort: false,
      visibility: true,
      key: 'typeWork',
      title: 'typeOfWork'
    },
    { uuid: '4', sort: true, visibility: true, key: 'countryName', title: 'foreignCompanies.country' },
    { uuid: '5', sort: true, visibility: true, key: 'regionName', title: 'foreignCompanies.region' },
    { uuid: '6', sort: true, visibility: true, key: 'phoneNumber', title: 'foreignCompanies.phone' },
    { uuid: '7', sort: true, visibility: true, key: 'email', title: 'foreignCompanies.email' },
    { uuid: '8', sort: true, visibility: true, key: 'fullAddress', title: 'foreignCompanies.fullAddress' },
    { uuid: '9', sort: true, visibility: true, key: 'fax', title: 'foreignCompanies.fax' },
    { uuid: '10', sort: true, visibility: true, key: 'webSite', title: 'foreignCompanies.webSite' },
    { uuid: '11', sort: true, visibility: true, key: 'founder', title: 'foreignCompanies.founder' }
  ])

  const foreignCompanies = ref<ForeignCompany[]>([])

  const getForeignCompanies = async (): Promise<void> => {
    try {
      const { data } = await GET_FOREIGN_COMPANIES({
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
      foreignCompanies.value = data?.map((governmentOrganization: ForeignCompany): ForeignCompany => {
        return {
          ...governmentOrganization,
          countryName: governmentOrganization.countryDTO?.name || '',
          regionName: governmentOrganization.regionDTO?.name || '',
          typeActivityName:
            governmentOrganization.typeActivityDTOS?.map((type: Item): string => type.name).join(', ') || '',
          organizationName: governmentOrganization.organizationDTO?.name || '',
          founder: governmentOrganization.founders
            ?.map((founder: Person) => `${founder.name || ''} ${founder.surname || ''} ${founder.patronomicName || ''}`)
            .join(', ')
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getForeignCompanies })

  sortKey.value = 'name'

  const loadingForeignCompany = ref<boolean>(false)

  const saveForeignCompany = async (form: ForeignCompany): Promise<void> => {
    try {
      loadingForeignCompany.value = true
      if (form.uuid) {
        await EDIT_FOREIGN_COMPANY({
          data: form
        })
      } else {
        await ADD_FOREIGN_COMPANY({
          data: form
        })
      }

      closePopUpForeignCompany()
      getForeignCompanies()
    } catch (error) {
      console.error(error)
    } finally {
      loadingForeignCompany.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteForeignCompany = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_FOREIGN_COMPANY({
        params: {
          companyUuid: selectedDeleteItem.value?.uuid
        }
      })
      getForeignCompanies()
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

  const selectedDeleteItem = ref<ForeignCompany | null>(null)
  const selectDeleteItem = (item: ForeignCompany) => {
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
      const { data } = await GET_FOREIGN_COMPANIES_COUNT({
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

  const getForeignCompany = async (uuid: string): Promise<ForeignCompany | null> => {
    try {
      const { data } = await GET_FOREIGN_COMPANY({
        params: {
          companyUuid: uuid
        }
      })
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const updatePage = (newPage: number) => {
    page.value = newPage
    getForeignCompanies()
  }
  const getSearch = (): void => {
    page.value = 1
    getForeignCompanies()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: ForeignCompany) => {
    if (action.id === 'EDIT') selectForeignCompany(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }
  const selectedForeignCompany = ref<ForeignCompany | null>(null)
  const selectForeignCompany = async (item: ForeignCompany): Promise<void> => {
    selectedForeignCompany.value = await getForeignCompany(item.uuid)
    openPopUpForeignCompany()
  }

  const showPopUpForeignCompany = ref<boolean>(false)
  const openPopUpForeignCompany = (): void => {
    showPopUpForeignCompany.value = true
  }
  const closePopUpForeignCompany = (): void => {
    showPopUpForeignCompany.value = false
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
    FILTER_NAME: 'foreignCompanies',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<ForeignCompany[]>([])
  const getAllForeignCompanies = async (): Promise<void> => {
    try {
      const { data } = await GET_FOREIGN_COMPANIES({
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
      getAllForeignCompanies()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: ForeignCompany) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, foreignCompany: ForeignCompany) => {
    if (status) {
      checkedItems.value.push(foreignCompany)
    } else {
      checkedItems.value = checkedItems.value.filter((item: ForeignCompany) => item.uuid !== foreignCompany.uuid)
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
      name: 'Иностранное компания',
      fileName: 'Иностранное компания.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpForeignCompany" :title="t('add')" append-icon="addCircle" />
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
        <text-field
          @update-value="search"
          :value="searchText"
          :placeholder="t('search')"
          prependIcon="search"
          width="360"
        />
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
            <tr v-for="foreignCompany in foreignCompanies">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, foreignCompany)"
                  :status="getChecked(foreignCompany.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectForeignCompany(foreignCompany)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(foreignCompany, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, foreignCompany)" :items="moreMenu" />
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
    <pop-up-foreign-company
      @save="saveForeignCompany"
      @close="closePopUpForeignCompany"
      :item="selectedForeignCompany"
      :loading="loadingForeignCompanies"
      v-if="showPopUpForeignCompany"
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
      @save="deleteForeignCompany"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
