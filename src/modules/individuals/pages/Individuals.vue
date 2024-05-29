<script setup lang="ts">
  import { ref, onMounted } from 'vue'

  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpShowIndividual from '../components/PopUpShowIndividual.vue'
  import PopUpIndividual from '../components/PopUpIndividual.vue'
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
  import { Individual } from '../types/index'

  import {
    GET_INDIVIDUALS,
    GET_INDIVIDUAL,
    GET_INDIVIDUALS_COUNT,
    ADD_INDIVIDUAL,
    EDIT_INDIVIDUAL,
    REMOVE_INDIVIDUAL
  } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    {
      uuid: '1',
      sort: true,
      visibility: true,
      key: 'fullName',
      title: 'individuals.fullNameOfPerson'
    },
    {
      uuid: '3',
      sort: true,
      visibility: true,
      key: 'phoneNumber',
      title: 'individuals.phone'
    },
    {
      uuid: '4',
      sort: true,
      visibility: true,
      key: 'email',
      title: 'individuals.email'
    },
    {
      uuid: '5',
      sort: true,
      visibility: true,
      key: 'knowledgeOfLanguages',
      title: 'individuals.languageSkills'
    },
    {
      uuid: '6',
      sort: true,
      visibility: true,
      key: 'birthPlace',
      title: 'individuals.placeOfBirth'
    },
    {
      uuid: '7',
      sort: true,
      visibility: true,
      key: 'birthDate',
      title: 'individuals.dateOfBirth'
    },
    {
      uuid: '8',
      sort: true,
      visibility: true,
      key: 'country',
      title: 'individuals.country'
    },
    {
      uuid: '9',
      sort: true,
      visibility: true,
      key: 'region',
      title: 'individuals.region'
    },
    {
      uuid: '2',
      sort: true,
      visibility: true,
      key: 'fullAddressOfResidence',
      title: 'individuals.fullResidentialAddress'
    },
    {
      uuid: '10',
      sort: true,
      visibility: true,
      key: 'fax',
      title: 'individuals.fax'
    },
    {
      uuid: '11',
      sort: true,
      visibility: true,
      key: 'education',
      title: 'individuals.education'
    },
    {
      uuid: '12',
      sort: true,
      visibility: true,
      key: 'experience',
      title: 'individuals.exprience'
    }
  ])

  const individuals = ref<Individual[]>([])

  const getIndividuals = async (): Promise<void> => {
    try {
      const { data } = await GET_INDIVIDUALS({
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
      individuals.value = data.map((individual: Individual) => {
        return {
          ...individual,
          fullName: `${individual.name || ''} ${individual.surname || ''} ${individual.patronomicName || ''}`,
          birthDate: getDate(individual.birthDate),
          country: individual.countryDTO?.name,
          region: individual.regionDTO?.name
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_INDIVIDUALS_COUNT({
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

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({
    getData: getIndividuals
  })

  sortKey.value = 'fullName'

  const updatePage = (newPage: number) => {
    page.value = newPage
    getIndividuals()
  }

  const getSearch = (): void => {
    page.value = 1
    getIndividuals()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })

  onMounted(() => {
    getSearch()
  })

  const loadingIndividual = ref<boolean>(false)

  const saveIndividual = async (form: Individual): Promise<void> => {
    try {
      loadingIndividual.value = true
      if (form.uuid) {
        await EDIT_INDIVIDUAL({
          data: form
        })
      } else {
        await ADD_INDIVIDUAL({
          data: form
        })
      }

      closePopUpIndividual()
      getIndividuals()
    } catch (error) {
      console.error(error)
    } finally {
      loadingIndividual.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteIndividual = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await REMOVE_INDIVIDUAL({
        params: {
          personUuid: selectedDeleteItem.value?.uuid
        }
      })
      getIndividuals()
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

  const selectedDeleteItem = ref<Individual | null>(null)
  const selectDeleteItem = (item: Individual) => {
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

  const getIndividual = async (uuid: string): Promise<Individual | null> => {
    try {
      const { data } = await GET_INDIVIDUAL({
        params: {
          personUuid: uuid
        }
      })
      return data
    } catch (error) {
      console.error(error)
      return null
    }
  }

  const selectAction = (action: More, item: Individual) => {
    if (action.id === 'EDIT') selectIndividual(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedShowIndividual = ref<Individual | null>(null)
  const selectShowIndividual = async (item: Individual): Promise<void> => {
    selectedShowIndividual.value = await getIndividual(item.uuid)
    openPopUpShowIndividual()
  }

  const showPopUpShowIndividual = ref<boolean>(false)
  const openPopUpShowIndividual = (): void => {
    showPopUpShowIndividual.value = true
  }
  const closePopUpShowIndividual = (): void => {
    showPopUpShowIndividual.value = false

    selectedShowIndividual.value = null
  }

  const selectedIndividual = ref<Individual | null>(null)
  const selectIndividual = async (item: Individual): Promise<void> => {
    selectedIndividual.value = await getIndividual(item.uuid)
    openPopUpIndividual()
  }

  const showPopUpIndividual = ref<boolean>(false)
  const openPopUpIndividual = (): void => {
    showPopUpIndividual.value = true
  }
  const closePopUpIndividual = (): void => {
    showPopUpIndividual.value = false

    selectedIndividual.value = null
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
    FILTER_NAME: 'individuals',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Individual[]>([])
  const getAllIndividuals = async (): Promise<void> => {
    try {
      const { data } = await GET_INDIVIDUALS({
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
      getAllIndividuals()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Individual) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, individual: Individual) => {
    if (status) {
      checkedItems.value.push(individual)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Individual) => item.uuid !== individual.uuid)
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
      name: 'Добавить Физическое лицо',
      fileName: 'Физическое лицо.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpIndividual" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="individual in individuals">
              <td>
                <my-checkbox
                  @update-status="(status) => updateCheckedItems(status, individual)"
                  :status="getChecked(individual.uuid)"
                />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectShowIndividual(individual)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(individual, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, individual)" :items="moreMenu" />
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
    <pop-up-show-individual
      @close="closePopUpShowIndividual"
      :item="selectedShowIndividual"
      v-if="showPopUpShowIndividual"
    />
    <pop-up-individual
      @save="saveIndividual"
      @close="closePopUpIndividual"
      :item="selectedIndividual"
      :loading="loadingIndividual"
      v-if="showPopUpIndividual"
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
      @save="deleteIndividual"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
