<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { TableHeadItem } from '@/types/index'
  import { More } from '@/types/menu'
  import { Newsletter } from '../types/index'

  import { DELETE_NEWSLETTER, GET_NEWSLETTERS, GET_NEWSLETTERS_COUNT } from '../api'

  const router = useRouter()

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>([{ id: 'DELETE', icon: 'delete', name: 'Удалить' }])

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'name', title: 'newsletters.name' },
    { uuid: '2', sort: true, visibility: true, key: 'text', title: 'newsletters.text' },
    { uuid: '3', sort: true, visibility: true, key: 'typeMailing', title: 'newsletters.typeMailing' }
  ])

  const newsletters = ref<Newsletter[]>([])

  const getNewsletters = async (): Promise<void> => {
    try {
      const { data } = await GET_NEWSLETTERS({
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

      newsletters.value = data
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getNewsletters })

  sortKey.value = 'mailingName'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_NEWSLETTERS_COUNT({
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
    getNewsletters()
  }

  const getSearch = (): void => {
    page.value = 1
    getNewsletters()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingDelete = ref<boolean>(false)
  const deleteNewsletter = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_NEWSLETTER({
        params: {
          mailingCompanyUuid: selectedDeleteItem.value?.uuid
        }
      })
      getNewsletters()
      pagesCount()
      closePopUpConfirmDelete()
    } catch (error) {
      console.error(error)
    } finally {
      loadingDelete.value = false
    }
  }

  const selectedDeleteItem = ref<Newsletter | null>(null)
  const selectDeleteItem = (item: Newsletter) => {
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

  const selectAction = (action: More, item: Newsletter) => {
    if (action.id === 'EDIT') openNewsletter(item.uuid)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const openNewsletter = (id: string = 'add') => {
    if (id === 'add') {
      router.push(`/newsletters/newsletter/add`)
    } else {
      router.push(`/newsletters/newsletter-preview/${id}`)
    }
  }

  const { startData, endData } = useDataCounts({ page, limit, count })

  const { getFilters, closeFilter, openFilter, saveFilter, selectedFilters, filterItems, showFilter } = useFilters({
    FILTER_NAME: 'newsletters',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Newsletter[]>([])
  const getAllNewsletters = async (): Promise<void> => {
    try {
      const { data } = await GET_NEWSLETTERS({
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
      getAllNewsletters()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Newsletter) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, newsletter: Newsletter) => {
    if (status) {
      checkedItems.value.push(newsletter)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Newsletter) => item.uuid !== newsletter.uuid)
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
      name: 'Рассылки',
      fileName: 'Рассылки.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openNewsletter()" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="newsletter in newsletters">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, newsletter)" :status="getChecked(newsletter.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="openNewsletter(newsletter.uuid)" v-if="head.visibility" class="__cursor-pointer">
                  {{ getValue(newsletter, head.key) }}
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, newsletter)" :items="moreMenu" />
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
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteNewsletter"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
  </teleport>
</template>
