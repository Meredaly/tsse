<script setup lang="ts">
  import { ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useRouter } from 'vue-router'

  import Icon from '@/UI/Icon'
  import MyButton from '@/UI/MyButton.vue'
  import Pagination from '@/UI/Pagination.vue'
  import TextField from '@/UI/TextField.vue'
  import MyCheckbox from '@/UI/MyCheckbox.vue'
  import Badge from '@/UI/Badge.vue'
  import DropdownDots from '@/UI/DropdownDots.vue'
  import PopUpSelectCheckbox from '@/components/PopUpSelectCheckbox.vue'
  import PopUpDeleteConfirm from '@/components/PopUpDeleteConfirm.vue'

  import { useTableFilter } from '@/composables/table'
  import { useFilters } from '@/composables/filters'
  import { useDataCounts } from '@/composables/dataCounts'
  import { useSearch } from '@/composables/search'

  import { more } from '@/helpers/menu'
  import { tableToExcel } from '@/helpers/tableToExcel'

  import { More } from '@/types/menu'
  import { TableHeadItem } from '@/types'
  import { Member } from '../types'

  import { DELETE_MEMBER, GET_MEMBERS, GET_MEMBERS_COUNT } from '../api'

  const router = useRouter()
  const { t } = useI18n()

  const page = ref<number>(1)
  const pages = ref<number>(1)
  const limit = ref<number>(25)
  const count = ref<number>(0)

  const moreMenu = ref<More[]>(more)

  const tableHead = ref<TableHeadItem[]>([
    { uuid: '1', sort: true, visibility: true, key: 'memberName', title: 'members.componyName' },
    { uuid: '2', sort: true, visibility: true, key: 'typeActivityNames', title: 'members.typeActivity' },
    { uuid: '3', sort: true, visibility: true, key: 'typeOwnership', title: 'members.typeOwnership' },
    { uuid: '4', sort: true, visibility: true, key: 'country', title: 'individuals.country' },
    { uuid: '5', sort: true, visibility: true, key: 'region', title: 'individuals.region' },
    { uuid: '6', sort: true, visibility: true, key: 'fullAddress', title: 'members.address' },
    { uuid: '7', sort: true, visibility: true, key: 'statusPayment', title: 'members.status' }
  ])

  const members = ref<Member[]>([])

  const typesOwnership = ref<any>({
    COMMERCIAL_SOCIETY: 'members.businessCompanies',
    PERSONAL_ENTERPRISE: 'members.privateEnterprices',
    FOREIGN_COMPANY: 'members.foreignCompany',
    STATE_ORGANIZATION: 'members.governmentOrganization',
    ENTREPRENEUR: 'members.entrepreneurs'
  })

  const statuses = ref<any>({
    PAYMENT_TIME_HAS_EXPIRED: 'warning',
    PAID: 'success'
  })
  const statusesText = ref<any>({
    PAYMENT_TIME_HAS_EXPIRED: 'members.timeIsUp',
    PAID: 'members.paid'
  })

  const getMembers = async (): Promise<void> => {
    try {
      const { data } = await GET_MEMBERS({
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
      members.value = data?.map((member: any) => {
        if ((member.typeCocaiotMember = 'IS_COMPANY')) {
          return {
            ...member,
            country: member.countryDTO?.name || '',
            region: member.regionDTO?.name || '',
            typeActivityNames: member.typeActivityNames?.join(', ') || '',
            typeOwnership: member.typeOwnership ? t(typesOwnership.value[member?.typeOwnership]) : ''
          }
        }
      })
    } catch (error) {
      console.error(error)
    }
  }

  const pagesCount = async (): Promise<void> => {
    try {
      const { data } = await GET_MEMBERS_COUNT({
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

  const { sortType, sortKey, tableFilter, getValue } = useTableFilter({ getData: getMembers })

  sortKey.value = 'memberName'

  const updatePage = (newPage: number) => {
    page.value = newPage
    getMembers()
  }

  const getSearch = (): void => {
    page.value = 1
    getMembers()
    pagesCount()
  }

  const { search, searchText } = useSearch({ getData: getSearch })
  getSearch()

  const loadingDelete = ref<boolean>(false)
  const deleteMember = async (): Promise<void> => {
    try {
      loadingDelete.value = true
      await DELETE_MEMBER({
        params: {
          memberUuid: selectedDeleteItem.value?.uuid
        }
      })
      getMembers()
      pagesCount()
      closePopUpConfirmDelete()
    } catch (error) {
      console.error(error)
    } finally {
      loadingDelete.value = false
    }
  }

  const selectedDeleteItem = ref<Member | null>(null)
  const selectDeleteItem = (item: Member) => {
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

  const selectAction = (action: More, item: Member) => {
    if (action.id === 'EDIT') editMember(item.uuid)

    if (action.id === 'DELETE') selectDeleteItem(item)
  }

  const editMember = (id: string = 'add'): void => {
    router.push(`/members/member/${id}`)
  }

  const openMember = (id: string = 'add'): void => {
    router.push(`/members/preview/${id}`)
  }

  const { startData, endData } = useDataCounts({ page, limit, count })

  const { getFilters, closeFilter, openFilter, saveFilter, selectedFilters, filterItems, showFilter } = useFilters({
    FILTER_NAME: 'members',
    TABLE_HEAD: tableHead.value
  })

  getFilters()

  const checkedItems = ref<Member[]>([])
  const getAllMembers = async (): Promise<void> => {
    try {
      const { data } = await GET_MEMBERS({
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
      getAllMembers()
    }
  }

  const getChecked = (uuid: string) => {
    return checkedItems.value.some((item: Member) => item.uuid === uuid)
  }

  const updateCheckedItems = (status: boolean, member: Member) => {
    if (status) {
      checkedItems.value.push(member)
    } else {
      checkedItems.value = checkedItems.value.filter((item: Member) => item.uuid !== member.uuid)
    }
  }

  const exportToExcel = () => {
    const newTableHead = tableHead.value.map((head) => {
      return {
        ...head,
        title: t(head.title)
      }
    })
    const tableCheckedItems = checkedItems.value.map((item) => {
      return {
        ...item,
        statusPayment: t(statusesText.value[item.statusPayment])
      }
    })

    tableToExcel({
      head: newTableHead,
      body: tableCheckedItems,
      name: 'Участники ТППТ',
      fileName: 'Участники ТППТ.xls'
    })
  }
</script>

<template>
  <div class="main">
    <div class="main__header">
      <div class="main__header-left">
        <my-button @click="editMember()" :title="t('add')" append-icon="addCircle" />
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
                  <my-checkbox @update-status="checkAll" :status="checkedItems.length === count && count !== 0 && count !== 0" />
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
            <tr v-for="member in members">
              <td>
                <my-checkbox @update-status="(status) => updateCheckedItems(status, member)" :status="getChecked(member.uuid)" />
              </td>
              <template v-for="head in tableHead">
                <td v-if="head.visibility && head.key !== 'statusPayment'" @click="openMember(member.uuid)" class="__cursor-pointer">
                  {{ getValue(member, head.key) }}
                </td>
                <td v-if="head.visibility && head.key === 'statusPayment'" @click="openMember(member.uuid)" class="__cursor-pointer">
                  <badge :title="t(statusesText[member.statusPayment])" :styles="statuses[member.statusPayment]" />
                </td>
              </template>
              <td>
                <dropdown-dots @select-item="(action:More) => selectAction(action, member)" :items="moreMenu" />
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
      @save="deleteMember"
      @close="closePopUpConfirmDelete"
      :loading="loadingDelete"
      v-if="showPopUpConfirmDelete"
      :title="t('youReallyWontDelete')"
    />
  </teleport>
</template>
