<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpPrivacyCompany from '../components/PopUpPrivacyCompany.vue'
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
  import { Item, Person, PrivacyCompany } from '../types/index'

  import {
    ADD_PRIVACY_COMPANY,
    DELETE_PRIVACY_COMPANY,
    EDIT_PRIVACY_COMPANY,
    GET_PRIVACY_COMPANIES,
    GET_PRIVACY_COMPANIES_COUNT,
    GET_PRIVACY_COMPANY
  } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'privateCompanies.nameCompany' },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'typeActivityName',
      title: 'privateCompanies.kindOfActivity'
    },
    {
      uuid: '3',
      sort: false,
      visibility: true,
      key: 'typeWork',
      title: 'typeOfWork'
    },
    { uuid: '4', sort: true, visibility: true, key: 'countryName', title: 'privateCompanies.country' },
    { uuid: '5', sort: true, visibility: true, key: 'regionName', title: 'privateCompanies.region' },
    { uuid: '7', sort: true, visibility: true, key: 'phoneNumber', title: 'privateCompanies.phone' },
    { uuid: '8', sort: true, visibility: true, key: 'email', title: 'privateCompanies.email' },
    { uuid: '9', sort: true, visibility: true, key: 'fullAddress', title: 'privateCompanies.fullAddress' },
    { uuid: '10', sort: true, visibility: true, key: 'fax', title: 'privateCompanies.fax' },
    { uuid: '11', sort: true, visibility: true, key: 'webSite', title: 'privateCompanies.webSite' },
    { uuid: '12', sort: true, visibility: true, key: 'founder', title: 'privateCompanies.founder' }
  ])

  const privacyCompanies = ref<PrivacyCompany[]>([])

  const getPrivacyCompanies = async (): Promise<void> => {
    try {
      const { data } = await GET_PRIVACY_COMPANIES({
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
      privacyCompanies.value = data?.map((governmentOrganization: PrivacyCompany): PrivacyCompany => {
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
  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getPrivacyCompanies })

  sortKey.value = 'name'

  const loadingPrivacyCompany = ref<boolean>(false)

  const savePrivacyCompany = async (form: PrivacyCompany): Promise<void> => {
    try {
      loadingPrivacyCompany.value = true
      if (form.uuid) {
        await EDIT_PRIVACY_COMPANY({
          data: form
        })
      } else {
        await ADD_PRIVACY_COMPANY({
          data: form
        })
      }

      closePopUpPrivacyCompany()
      getPrivacyCompanies()
    } catch (error) {
      console.error(error)
    } finally {
      loadingPrivacyCompany.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deletePrivacyCompany = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_PRIVACY_COMPANY({
        params: {
          companyUuid: selectedDeleteItem.value?.uuid
        }
      })
      getPrivacyCompanies()
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

  const selectedDeleteItem = ref<PrivacyCompany | null>(null)
  const selectDeleteItem = (item: PrivacyCompany) => {
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
      const { data } = await GET_PRIVACY_COMPANIES_COUNT({
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

  const getPrivacyCompany = async (uuid: string): Promise<PrivacyCompany | null> => {
    try {
      const { data } = await GET_PRIVACY_COMPANY({
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
    getPrivacyCompanies()
  }
  const getSearch = (): void => {
    page.value = 1
    getPrivacyCompanies()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: PrivacyCompany) => {
    if (action.id === 'EDIT') selectPrivacyCompany(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedPrivacyCompany = ref<PrivacyCompany | null>(null)
  const selectPrivacyCompany = async (item: PrivacyCompany): Promise<void> => {
    selectedPrivacyCompany.value = await getPrivacyCompany(item.uuid)
    openPopUpPrivacyCompany()
  }

  const showPopUpPrivacyCompany = ref<boolean>(false)
  const openPopUpPrivacyCompany = (): void => {
    showPopUpPrivacyCompany.value = true
  }
  const closePopUpPrivacyCompany = (): void => {
    showPopUpPrivacyCompany.value = false

    selectedPrivacyCompany.value = null
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
    FILTER_NAME: 'privacyCompanies',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<PrivacyCompany[]>([])
  const getAllPrivacyCompanies = async (): Promise<void> => {
    try {
      const { data } = await GET_PRIVACY_COMPANIES({
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
      getAllPrivacyCompanies()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: PrivacyCompany) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, privacyCompany: PrivacyCompany) => {
    if (status) {
      checkedItems.value.push(privacyCompany)
    } else {
      checkedItems.value = checkedItems.value.filter((item: PrivacyCompany) => item.uuid !== privacyCompany.uuid)
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
      name: 'Частные предприятия',
      fileName: 'Частные предприятия.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpPrivacyCompany" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="privacyCompany in privacyCompanies">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, privacyCompany)"
                  :status="getChecked(privacyCompany.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectPrivacyCompany(privacyCompany)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(privacyCompany, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, privacyCompany)" :items="moreMenu" />
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
    <pop-up-privacy-company
      @save="savePrivacyCompany"
      @close="closePopUpPrivacyCompany"
      :item="selectedPrivacyCompany"
      :loading="loadingPrivacyCompany"
      v-if="showPopUpPrivacyCompany"
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
      @save="deletePrivacyCompany"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
