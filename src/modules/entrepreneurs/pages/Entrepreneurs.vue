<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'

  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpEntrepreneur from '../components/PopUpEntrepreneur.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'
  import PopUpNotDeletable from '@/components/PopUpNotDeletable.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'

  import { more } from '@/helpers/menu'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { getDate } from '@/helpers/date'

  import { TableHeadItem } from '@/types/index'
  import { More } from '@/types/menu'
  import { Item, EntrepreneurSave, EntrepreneurData, EntrepreneurTable } from '../types/index'

  import {
    GET_ENTREPRENEURS,
    GET_ENTREPRENEURS_COUNT,
    ADD_ENTREPRENEUR,
    EDIT_ENTREPRENEUR,
    DELETE_ENTREPRENEUR,
    GET_ENTREPRENEUR
  } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(10)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'fullName', title: 'enterpreneur.fullNameOfPerson' },
    { uuid: '3', sort: true, visibility: true, key: 'phoneNumber', title: 'enterpreneur.phone' },
    { uuid: '4', sort: true, visibility: true, key: 'email', title: 'enterpreneur.email' },
    { uuid: '5', sort: true, visibility: true, key: 'knowledgeOfLanguages', title: 'enterpreneur.languageSkills' },
    { uuid: '6', sort: true, visibility: true, key: 'birthPlace', title: 'enterpreneur.placeOfBirth' },
    { uuid: '7', sort: true, visibility: true, key: 'birthDate', title: 'enterpreneur.dateOfBirth' },
    {
      uuid: '3',
      sort: false,
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
    { uuid: '8', sort: true, visibility: true, key: 'country', title: 'enterpreneur.country' },
    { uuid: '9', sort: true, visibility: true, key: 'region', title: 'enterpreneur.region' },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'fullAddressOfResidence',
      title: 'individuals.fullResidentialAddress'
    },
    { uuid: '10', sort: true, visibility: true, key: 'fax', title: 'enterpreneur.fax' },
    { uuid: '11', sort: true, visibility: true, key: 'education', title: 'enterpreneur.education' },
    { uuid: '12', sort: true, visibility: true, key: 'experience', title: 'enterpreneur.exprience' }
  ])

  const entrepreneurs = ref<EntrepreneurTable[]>([])

  const getEntrepreneurs = async (): Promise<void> => {
    try {
      const { data } = await GET_ENTREPRENEURS({
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

      entrepreneurs.value =
        data?.map((entrepreneur: EntrepreneurData) => {
          return {
            ...entrepreneur,
            uuid: entrepreneur.uuid,
            fullName: `${entrepreneur.personDTO.name || ''} ${entrepreneur.personDTO.surname || ''} ${
              entrepreneur.personDTO.patronomicName || ''
            }`,
            birthPlace: entrepreneur.personDTO.birthPlace,
            birthDate: getDate(entrepreneur.personDTO.birthDate),
            country: entrepreneur.personDTO.countryDTO?.name,
            region: entrepreneur.personDTO.regionDTO?.name,
            fullAddressOfResidence: entrepreneur.personDTO?.fullAddressOfResidence,
            phoneNumber: entrepreneur.personDTO?.phoneNumber,
            fax: entrepreneur.personDTO.fax,
            email: entrepreneur.personDTO.email,
            education: entrepreneur.personDTO.education,
            experience: entrepreneur.personDTO.experience,
            knowledgeOfLanguages: entrepreneur.personDTO.knowledgeOfLanguages,
            typeActivityName: entrepreneur.typeActivityDTOS?.map((type: Item): string => type.name).join(', ') || ''
          }
        }) || []
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getEntrepreneurs })

  sortKey.value = 'fullName'

  const loadingEntrepreneur = ref<boolean>(false)

  const saveEntrepreneur = async (form: EntrepreneurSave): Promise<void> => {
    try {
      loadingEntrepreneur.value = true
      if (form.entrepreneurUuid) {
        await EDIT_ENTREPRENEUR({
          data: form
        })
      } else {
        await ADD_ENTREPRENEUR({
          data: form
        })
      }

      closePopUpEntrepreneur()
      getEntrepreneurs()
    } catch (error) {
      console.error(error)
    } finally {
      loadingEntrepreneur.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteEntrepreneur = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_ENTREPRENEUR({
        params: {
          entrepreneurUuid: selectedDeleteItem.value?.uuid
        }
      })
      getEntrepreneurs()
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

  const selectedDeleteItem = ref<EntrepreneurTable | null>(null)
  const selectDeleteItem = (item: EntrepreneurTable) => {
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
      const { data } = await GET_ENTREPRENEURS_COUNT({
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

  const getEntrepreneur = async (uuid: string): Promise<EntrepreneurData | null> => {
    try {
      const { data } = await GET_ENTREPRENEUR({
        params: {
          entrepreneurUuid: uuid
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
    getEntrepreneurs()
  }
  const getSearch = (): void => {
    page.value = 1
    getEntrepreneurs()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const selectAction = (action: More, item: EntrepreneurTable) => {
    if (action.id === 'EDIT') selectEntrepreneur(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedEntrepreneur = ref<EntrepreneurData | null>(null)
  const selectEntrepreneur = async (item: EntrepreneurTable): Promise<void> => {
    selectedEntrepreneur.value = await getEntrepreneur(item.uuid)
    openPopUpEntrepreneur()
  }

  const showPopUpEntrepreneur = ref<boolean>(false)
  const openPopUpEntrepreneur = (): void => {
    showPopUpEntrepreneur.value = true
  }
  const closePopUpEntrepreneur = (): void => {
    showPopUpEntrepreneur.value = false

    selectedEntrepreneur.value = null
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
    FILTER_NAME: 'entrepreneurs',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<EntrepreneurTable[]>([])
  const getAllEntrepreneurs = async (): Promise<void> => {
    try {
      const { data } = await GET_ENTREPRENEURS({
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
      getAllEntrepreneurs()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: EntrepreneurTable) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, enterpreneur: EntrepreneurTable) => {
    if (status) {
      checkedItems.value.push(enterpreneur)
    } else {
      checkedItems.value = checkedItems.value.filter((item: EntrepreneurTable) => item.uuid !== enterpreneur.uuid)
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
      name: 'Предпринимателя',
      fileName: 'Предпринимателя.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpEntrepreneur" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="entrepreneur in entrepreneurs">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, entrepreneur)"
                  :status="getChecked(entrepreneur.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectEntrepreneur(entrepreneur)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(entrepreneur, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action: More) => selectAction(action, entrepreneur)" :items="moreMenu" />
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
    <pop-up-entrepreneur
      @save="saveEntrepreneur"
      @close="closePopUpEntrepreneur"
      :item="selectedEntrepreneur"
      :loading="loadingEntrepreneur"
      v-if="showPopUpEntrepreneur"
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
      @save="deleteEntrepreneur"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
