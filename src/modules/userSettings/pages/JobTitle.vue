<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpJobTitle from '../components/PopUpJobTitle.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'
  import PopUpNotDeletable from '@/components/PopUpNotDeletable.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { More } from '@/types/menu'

  import { TableHeadItem } from '@/types/index'
  import { more } from '@/helpers/menu'
  import { JobTitle, JobTitleData } from '../types/index'

  import { ADD_JOB_TITLE, DELETE_JOB_TITLE, EDIT_JOB_TITLE, GET_JOB_TITLES, GET_JOB_TITLES_COUNT } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([{ uuid: '1', sort: true, visibility: true, key: 'roleName', title: 'userSettings.jobTitle' }])

  const jobTitles = ref<JobTitle[]>([])

  const getJobTitles = async (): Promise<void> => {
    try {
      const { data } = await GET_JOB_TITLES({
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

      jobTitles.value = data
        .map((jobTitle: JobTitle) => {
          return {
            ...jobTitle,
            roleName: jobTitle.name
          }
        })
        .filter((jobTitle: JobTitle): boolean => jobTitle.name !== 'Admin')
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getJobTitles })

  sortKey.value = 'roleName'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_JOB_TITLES_COUNT({
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
    getJobTitles()
  }

  const getSearch = (): void => {
    page.value = 1
    getJobTitles()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingJobTitle = ref<boolean>(false)
  const saveJobTitle = async (form: JobTitleData): Promise<void> => {
    try {
      loadingJobTitle.value = true
      if (form.uuid) {
        await EDIT_JOB_TITLE({
          data: form
        })
      } else {
        await ADD_JOB_TITLE({
          data: form
        })
      }

      closePopUpJobTitle()
      getJobTitles()
    } catch (error) {
      console.error(error)
    } finally {
      loadingJobTitle.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteJobTitle = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_JOB_TITLE({
        params: {
          roleUuid: selectedDeleteItem.value?.uuid
        }
      })
      getJobTitles()
      pagesCount()
      closePopUpConfirmDelete()
    } catch (error: any) {
      console.error(error)
      if (error.response.status === 424) {
        closePopUpConfirmDelete()
        openPopUpShowNotDeletable()
      }
    } finally {
      loadingDelete.value = false
    }
  }

  const selectedDeleteItem = ref<JobTitle | null>(null)
  const selectDeleteItem = (item: JobTitle) => {
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

  const selectAction = (action: More, item: JobTitle) => {
    if (action.id === 'EDIT') selectJobTitle(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedJobTitle = ref<JobTitle | null>(null)
  const selectJobTitle = (item: JobTitle) => {
    selectedJobTitle.value = item
    openPopUpJobTitle()
  }

  const showPopUpJobTitle = ref<boolean>(false)
  const openPopUpJobTitle = (): void => {
    showPopUpJobTitle.value = true
  }
  const closePopUpJobTitle = (): void => {
    showPopUpJobTitle.value = false

    selectedJobTitle.value = null
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
    FILTER_NAME: 'jobTitles',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<JobTitle[]>([])
  const getAllJobTitles = async (): Promise<void> => {
    try {
      const { data } = await GET_JOB_TITLES({
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
      checkedItems.value = data.map((jobTitle: JobTitle) => {
        return {
          ...jobTitle,
          roleName: jobTitle?.name || ''
        }
      })
    } catch (error) {
      console.error(error)
    }
  }
  const checkAll = (): void => {
    if (checkedItems.value.length === count.value) {
      checkedItems.value = []
    } else {
      getAllJobTitles()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: JobTitle) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, jobTitle: JobTitle) => {
    if (status) {
      checkedItems.value.push(jobTitle)
    } else {
      checkedItems.value = checkedItems.value.filter((item: JobTitle) => item.uuid !== jobTitle.uuid)
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
      name: 'Должность',
      fileName: 'Должность.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpJobTitle" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="jobTitle in jobTitles">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, jobTitle)" :status="getChecked(jobTitle.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectJobTitle(jobTitle)" v-if="head.visibility" class="__cursor-pointer">{{ getValue(jobTitle, head.key) }}</td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, jobTitle)" :items="moreMenu" />
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
    <pop-up-job-title @save="saveJobTitle" @close="closePopUpJobTitle" :item="selectedJobTitle" :loading="loadingJobTitle" v-if="showPopUpJobTitle" />
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteJobTitle"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
    <pop-up-not-deletable @close="closePopUpShowNotDeletable" v-if="showNotDeletable" />
  </teleport>
</template>
