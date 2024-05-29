<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpUser from '../components/PopUpUser.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { more } from '@/helpers/menu'

  import { TableHeadItem } from '@/types/index'
  import { More } from '@/types/menu'
  import { User } from '../types/index'

  import { GET_USERS, ADD_USER, EDIT_USER, DELETE_USER, GET_USERS_COUNT } from '../api'

  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'fullName', title: 'userSettings.fio' },
    { uuid: '2', sort: true, visibility: true, key: 'roleName', title: 'userSettings.jobTitle' }
  ])

  const users = ref<User[]>([])

  const getUsers = async (): Promise<void> => {
    try {
      const { data } = await GET_USERS({
        params: {
          page: page.value - 1,
          size: limit.value
        },
        data: {
          searchKey: searchText.value
          // sort: [
          //   {
          //     sortBy: sortKey.value,
          //     sortType: sortType.value ? 'ASCENDING' : 'DESCENDING'
          //   }
          // ]
        }
      })

      users.value = data
        ?.map((user: any) => {
          return {
            uuid: user.uuid,
            fullName: `${user.name || ''} ${user.surname || ''} ${user.patronomicName != 'null' ? user.patronomicName : ''}`,
            roleName: user.roleDTO.name
          }
        })
        .filter((user: User): boolean => user.roleName !== 'Admin')
    } catch (error) {
      console.error(error)
    }
  }

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getUsers })

  sortKey.value = 'fullName'

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_USERS_COUNT({
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
    getUsers()
  }

  const getSearch = (): void => {
    page.value = 1
    getUsers()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingUser = ref<boolean>(false)
  const saveError = ref<boolean>(false)
  const saveUser = async (form: User): Promise<void> => {
    try {
      loadingUser.value = true
      saveError.value = false
      if (form.uuid) {
        await EDIT_USER({
          data: form
        })
      } else {
        await ADD_USER({
          data: form
        })
      }

      closePopUpUser()
      getUsers()
    } catch (error) {
      console.error(error)
      saveError.value = true
    } finally {
      loadingUser.value = false
    }
  }

  const loadingDelete = ref<boolean>(false)
  const deleteUser = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_USER({
        params: {
          userUuid: selectedDeleteItem.value?.uuid
        }
      })
      getUsers()
      pagesCount()
      closePopUpConfirmDelete()
    } catch (error) {
      console.error(error)
    } finally {
      loadingDelete.value = false
    }
  }

  const selectedDeleteItem = ref<User | null>(null)
  const selectDeleteItem = (item: User) => {
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

  const selectAction = (action: More, item: User) => {
    if (action.id === 'EDIT') selectUser(item)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const selectedUser = ref<User | null>(null)
  const selectUser = (item: User) => {
    selectedUser.value = item
    openPopUpUser()
  }

  const showPopUpUser = ref<boolean>(false)
  const openPopUpUser = (): void => {
    showPopUpUser.value = true
  }
  const closePopUpUser = (): void => {
    showPopUpUser.value = false

    selectedUser.value = null
  }

  const { startData, endData } = useDataCounts({ page, limit, count })

  const { getFilters, closeFilter, openFilter, saveFilter, selectedFilters, filterItems, showFilter } = useFilters({
    FILTER_NAME: 'users',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<User[]>([])
  const getAllJobTitles = async (): Promise<void> => {
    try {
      const { data } = await GET_USERS({
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
        ?.map((user: any) => {
          return {
            uuid: user.uuid,
            fullName: `${user.name || ''} ${user.surname || ''} ${user.patronomicName != 'null' ? user.patronomicName : ''}`,
            roleName: user.roleDTO.name
          }
        })
        .filter((user: User): boolean => user.roleName !== 'Admin')
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
    return checkedItems.value.some((item: User) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, user: User) => {
    if (status) {
      checkedItems.value.push(user)
    } else {
      checkedItems.value = checkedItems.value.filter((item: User) => item.uuid !== user.uuid)
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
      name: 'Пользователи',
      fileName: 'Пользователи.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="openPopUpUser" :title="t('add')" append-icon="addCircle" />
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
            <tr v-for="user in users">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, user)" :status="getChecked(user.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td @click="selectUser(user)" v-if="head.visibility" class="__cursor-pointer">{{ getValue(user, head.key) }}</td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, user)" :items="moreMenu" />
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
    <pop-up-user @save="saveUser" @close="closePopUpUser" :item="selectedUser" :loading="loadingUser" :error="saveError" v-if="showPopUpUser" />
    <pop-up-select-checkbox
      @save="saveFilter"
      @close="closeFilter"
      :items="filterItems"
      :selected-items="selectedFilters"
      v-if="showFilter"
      :title="t('filters')"
    />
    <pop-up-delete-confirm
      @save="deleteUser"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
  </teleport>
</template>
