<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpHouseholdSociety from '../components/PopUpHouseholdSociety.vue'
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
  import { Item, HouseholdSociety } from '../types/index'

  import {
    ADD_HOUSEHOLD_SOCIETY,
    DELETE_HOUSEHOLD_SOCIETY,
    EDIT_HOUSEHOLD_SOCIETY,
    GET_HOUSEHOLD_SOCIETIES,
    GET_HOUSEHOLD_SOCIETIES_COUNT,
    GET_HOUSEHOLD_SOCIETY
  } from '../api'
  import { Person } from '../types/index'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'householdSocieties.nameCompany' },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'typeActivityName',
      title: 'householdSocieties.kindOfActivity'
    },
    {
      uuid: '3',
      sort: false,
      visibility: true,
      key: 'typeWork',
      title: 'typeOfWork'
    },
    { uuid: '4', sort: true, visibility: true, key: 'countryName', title: 'householdSocieties.country' },
    { uuid: '5', sort: true, visibility: true, key: 'regionName', title: 'householdSocieties.region' },
    { uuid: '7', sort: true, visibility: true, key: 'phoneNumber', title: 'householdSocieties.phoneNumber' },
    { uuid: '8', sort: true, visibility: true, key: 'email', title: 'householdSocieties.email' },
    { uuid: '9', sort: true, visibility: true, key: 'fullAddress', title: 'householdSocieties.fullAddress' },
    { uuid: '10', sort: true, visibility: true, key: 'fax', title: 'householdSocieties.fax' },
    { uuid: '11', sort: true, visibility: true, key: 'webSite', title: 'householdSocieties.webSite' },
    { uuid: '12', sort: true, visibility: true, key: 'founder', title: 'householdSocieties.founder' }
  ])

  const householdSocieties = ref<HouseholdSociety[]>([])

  const getHouseholdSocieties = async (): Promise<void> => {
    try {
      const { data } = await GET_HOUSEHOLD_SOCIETIES({
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
      householdSocieties.value = data?.map((governmentOrganization: HouseholdSociety): HouseholdSociety => {
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
  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getHouseholdSocieties })

  sortKey.value = 'name'

  const loadingHouseholdSociety = ref<boolean>(false)

  const saveHouseholdSociety = async (form: HouseholdSociety): Promise<void> => {
    try {
      loadingHouseholdSociety.value = true
      if (form.uuid) {
        await EDIT_HOUSEHOLD_SOCIETY({
          data: form
        })
      } else {
        await ADD_HOUSEHOLD_SOCIETY({
          data: form
        })
      }

      closePopUpHouseholdSociety()
      getHouseholdSocieties()
    } catch (error) {
      console.error(error)
    } finally {
      loadingHouseholdSociety.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteHouseholdSociety = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_HOUSEHOLD_SOCIETY({
        params: {
          companyUuid: selectedDeleteItem.value?.uuid
        }
      })
      getHouseholdSocieties()
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

  const selectedDeleteItem = ref<HouseholdSociety | null>(null)
  const selectDeleteItem = (item: HouseholdSociety) => {
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
      const { data } = await GET_HOUSEHOLD_SOCIETIES_COUNT({
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

  const getHouseholdSociety = async (uuid: string): Promise<HouseholdSociety | null> => {
    try {
      const { data } = await GET_HOUSEHOLD_SOCIETY({
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
    getHouseholdSocieties()
  }

  const getSearch = (): void => {
    page.value = 1
    getHouseholdSocieties()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: HouseholdSociety) => {
    if (action.id === 'EDIT') selectHouseholdSociety(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedHouseholdSociety = ref<HouseholdSociety | null>(null)
  const selectHouseholdSociety = async (item: HouseholdSociety): Promise<void> => {
    selectedHouseholdSociety.value = await getHouseholdSociety(item.uuid)
    openPopUpHouseholdSociety()
  }

  const showPopUpHouseholdSociety = ref<boolean>(false)
  const openPopUpHouseholdSociety = (): void => {
    showPopUpHouseholdSociety.value = true
  }
  const closePopUpHouseholdSociety = (): void => {
    showPopUpHouseholdSociety.value = false
    selectedHouseholdSociety.value = null
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
    FILTER_NAME: 'householdSocieties',
    TABLE_HEAD: tableHead.value
  })

  getFilters()
  const checkedItems = ref<HouseholdSociety[]>([])
  const getAllHouseholdSocieties = async (): Promise<void> => {
    try {
      const { data } = await GET_HOUSEHOLD_SOCIETIES({
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
      getAllHouseholdSocieties()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: HouseholdSociety) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, householdSociety: HouseholdSociety) => {
    if (status) {
      checkedItems.value.push(householdSociety)
    } else {
      checkedItems.value = checkedItems.value.filter((item: HouseholdSociety) => item.uuid !== householdSociety.uuid)
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
      name: 'Хозяйственное общества',
      fileName: 'Хозяйственное общества.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpHouseholdSociety" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="householdSociety in householdSocieties">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, householdSociety)"
                  :status="getChecked(householdSociety.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectHouseholdSociety(householdSociety)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(householdSociety, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots
                  @select-item="(action:More) => selectAction(action, householdSociety)"
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
    <pop-up-household-society
      @save="saveHouseholdSociety"
      @close="closePopUpHouseholdSociety"
      :item="selectedHouseholdSociety"
      :loading="loadingHouseholdSociety"
      v-if="showPopUpHouseholdSociety"
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
      @save="deleteHouseholdSociety"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
