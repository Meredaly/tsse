<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpGovernmentOrganization from '../components/PopUpGovernmentOrganization.vue'
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
  import { Item, GovernmentOrganization, GovernmentOrganizationData } from '../types/index'

  import {
    GET_GOVERNMENT_ORGANIZATIONS,
    GET_GOVERNMENT_ORGANIZATIONS_COUNT,
    EDIT_GOVERNMENT_ORGANIZATION,
    ADD_GOVERNMENT_ORGANIZATION,
    DELETE_GOVERNMENT_ORGANIZATION,
    GET_GOVERNMENT_ORGANIZATION
  } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'governmentOrganizations.nameCompany' },
    { uuid: '2', sort: true, visibility: true, key: 'organizationName', title: 'governmentOrganizations.ministry' },
    {
      uuid: '3',
      sort: true,
      visibility: true,
      key: 'typeActivityName',
      title: 'governmentOrganizations.kindOfActivity'
    },
    {
      uuid: '4',
      sort: false,
      visibility: true,
      key: 'typeWork',
      title: 'typeOfWork'
    },
    { uuid: '5', sort: true, visibility: true, key: 'countryName', title: 'governmentOrganizations.country' },
    { uuid: '6', sort: true, visibility: true, key: 'regionName', title: 'governmentOrganizations.region' },
    { uuid: '7', sort: true, visibility: true, key: 'phoneNumber', title: 'governmentOrganizations.phone' },
    { uuid: '8', sort: true, visibility: true, key: 'email', title: 'governmentOrganizations.email' },
    { uuid: '9', sort: true, visibility: true, key: 'fullAddress', title: 'governmentOrganizations.allAddress' },
    { uuid: '10', sort: true, visibility: true, key: 'fax', title: 'governmentOrganizations.fax' },
    { uuid: '11', sort: true, visibility: true, key: 'webSite', title: 'governmentOrganizations.webSite' }
  ])

  const governmentOrganizations = ref<GovernmentOrganization[]>([])

  const getGovernmentOrganizations = async (): Promise<void> => {
    try {
      const { data } = await GET_GOVERNMENT_ORGANIZATIONS({
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
      governmentOrganizations.value = data?.map(
        (governmentOrganization: GovernmentOrganization): GovernmentOrganization => {
          return {
            ...governmentOrganization,
            countryName: governmentOrganization.countryDTO?.name || '',
            regionName: governmentOrganization.regionDTO?.name || '',
            typeActivityName:
              governmentOrganization.typeActivityDTOS?.map((type: Item): string => type.name).join(', ') || '',
            organizationName: governmentOrganization.organizationDTO?.name || ''
          }
        }
      )
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getGovernmentOrganizations })

  sortKey.value = 'name'

  const loadingGovernmentOrganization = ref<boolean>(false)

  const saveGovernmentOrganization = async (form: GovernmentOrganizationData): Promise<void> => {
    try {
      loadingGovernmentOrganization.value = true
      if (form.uuid) {
        await EDIT_GOVERNMENT_ORGANIZATION({
          data: form
        })
      } else {
        await ADD_GOVERNMENT_ORGANIZATION({
          data: form
        })
      }

      closePopUpGovernmentOrganization()
      getGovernmentOrganizations()
    } catch (error) {
      console.error(error)
    } finally {
      loadingGovernmentOrganization.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteGovernmentOrganization = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_GOVERNMENT_ORGANIZATION({
        params: {
          companyUuid: selectedDeleteItem.value?.uuid
        }
      })
      getGovernmentOrganizations()
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

  const selectedDeleteItem = ref<GovernmentOrganization | null>(null)
  const selectDeleteItem = (item: GovernmentOrganization) => {
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
      const { data } = await GET_GOVERNMENT_ORGANIZATIONS_COUNT({
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

  const getGovernmentOrganization = async (uuid: string): Promise<GovernmentOrganization | null> => {
    try {
      const { data } = await GET_GOVERNMENT_ORGANIZATION({
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
    getGovernmentOrganizations()
  }
  const getSearch = (): void => {
    page.value = 1
    getGovernmentOrganizations()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: GovernmentOrganization) => {
    if (action.id === 'EDIT') selectGovernmentOrganization(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedGovernmentOrganization = ref<GovernmentOrganization | null>(null)
  const selectGovernmentOrganization = async (item: GovernmentOrganization): Promise<void> => {
    selectedGovernmentOrganization.value = await getGovernmentOrganization(item.uuid)
    openPopUpGovernmentOrganization()
  }

  const showPopUpGovernmentOrganization = ref<boolean>(false)
  const openPopUpGovernmentOrganization = (): void => {
    showPopUpGovernmentOrganization.value = true
  }
  const closePopUpGovernmentOrganization = (): void => {
    showPopUpGovernmentOrganization.value = false

    selectedGovernmentOrganization.value = null
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
    FILTER_NAME: 'governmentOrganization',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<GovernmentOrganization[]>([])
  const getAllGovernmentOrganizations = async (): Promise<void> => {
    try {
      const { data } = await GET_GOVERNMENT_ORGANIZATIONS({
        params: {
          page: 0,
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
      getAllGovernmentOrganizations()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: GovernmentOrganization) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, governmentOrganization: GovernmentOrganization) => {
    if (status) {
      checkedItems.value.push(governmentOrganization)
    } else {
      checkedItems.value = checkedItems.value.filter(
        (item: GovernmentOrganization) => item.uuid !== governmentOrganization.uuid
      )
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
      name: 'Государственное организация',
      fileName: 'Государственное организация.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpGovernmentOrganization" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="governmentOrganization in governmentOrganizations">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, governmentOrganization)"
                  :status="getChecked(governmentOrganization.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td
                  @click="selectGovernmentOrganization(governmentOrganization)"
                  v-if="head.visibility"
                  class="__cursor-pointer"
                >
                  {{ getValue(governmentOrganization, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots
                  @select-item="(action:More) => selectAction(action, governmentOrganization)"
                  :items="moreMenu"
                />
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
    <pop-up-government-organization
      @save="saveGovernmentOrganization"
      @close="closePopUpGovernmentOrganization"
      :item="selectedGovernmentOrganization"
      :loading="loadingGovernmentOrganization"
      v-if="showPopUpGovernmentOrganization"
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
      @save="deleteGovernmentOrganization"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
