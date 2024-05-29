<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { useAuth } from '@/store/auth'

  import Icon from '@/UI/Icon'
  import menuList from './menu'

  const auth = useAuth()

  const roles = computed(() => auth.getRoles)

  const props = defineProps({
    mini: { type: Boolean, default: false }
  })
  const { t } = useI18n()

  const menu = ref(menuList)

  const selectedGroupId = ref<number>(0)
  const selectGroupId = (id: number) => {
    selectedGroupId.value = selectedGroupId.value === id ? 0 : id
  }
  const deleteGroupId = () => {
    selectedGroupId.value = 0
  }
</script>

<template>
  <div :class="['sidebar', '__box', { _mini: props.mini }]">
    <div class="sidebar__box">
      <div class="sidebar__header">
        <router-link to="/" class="sidebar__logo">
          <img src="@/assets/img/logo.png" alt="logo" />
        </router-link>
      </div>
      <div class="sidebar__menu">
        <div class="menu">
          <div class="menu__body">
            <div class="menu__list">
              <template v-for="menuItem in menu" :key="menuItem.id">
                <template v-if="menuItem.group">
                  <div class="menu__group">
                    <button
                      @click="selectGroupId(menuItem.id)"
                      :class="[
                        'menu__group-button',
                        {
                          'menu__group-button_active': selectedGroupId == menuItem.id
                        }
                      ]"
                    >
                      <p>{{ t(menuItem.group.title) }}</p>
                      <icon name="chevronBottom" />
                    </button>
                    <div v-if="selectedGroupId == menuItem.id" class="menu__group-body">
                      <template v-for="groupItem in menuItem.group.groupItems">
                        <div v-if="roles.includes(groupItem.role)" class="menu__item">
                          <router-link :to="groupItem.link" exact class="menu__link">
                            <icon :name="groupItem.icon" />
                            <p>{{ t(groupItem.title) }}</p>
                          </router-link>
                          <div v-if="groupItem.sub" class="menu__sub">
                            <ul class="menu__sub-list">
                              <li v-for="subItem in groupItem.sub" class="menu__sub-item">
                                <router-link :to="subItem.link" exact class="menu__sub-link">
                                  <p>{{ t(subItem.title) }}</p>
                                </router-link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <template v-if="!menuItem.group && menuItem.role">
                  <div v-if="roles.includes(menuItem.role)" class="menu__item">
                    <router-link :to="menuItem.link" @click="deleteGroupId" exact class="menu__link">
                      <icon :name="menuItem.icon" />
                      <p>{{ t(menuItem.title) }}</p>
                    </router-link>
                    <div v-if="menuItem.sub" class="menu__sub">
                      <ul class="menu__sub-list">
                        <li v-for="subItem in menuItem.sub" class="menu__sub-item">
                          <router-link :to="subItem.link" @click="deleteGroupId" exact class="menu__sub-link">
                            <p>{{ t(subItem.title) }}</p>
                          </router-link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  @import './index.scss';
</style>
