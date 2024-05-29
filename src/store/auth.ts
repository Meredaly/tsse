import { defineStore } from 'pinia'
import { useCookies } from 'vue3-cookies'
import { CHECK_AUTH } from '@/api/auth.api'
import router from '@/router'

const rolesName = {
  Статистика: 'STATS',
  'Участники ТППТ': 'MEMBERS',
  'Физическое лицо': 'INDIVIDUALS',
  'Вид деятельности': 'KIND_OF_ACTIVITY',
  Предприниматели: 'ENTREPRENEURS',
  'Государственные организаци': 'GOVERNMENT_ORGANIZATION',
  'Хозяйственные общества': 'HOUSEHOLD_SOCIETIES',
  'Частные предприятия': 'PRIVATE_COMPANIES',
  'Иностранные компании': 'FOREIGN_COMPANIES',
  Рассылки: 'NEWSLETTERS',
  Министерствы: 'MINISTRIES',
  Локализация: 'LOCALIZATION',
  'Настройки пользователи': 'USER_SETTINGS'
} as never

export const useAuth = defineStore({
  id: 'auth',
  state: () => ({
    auth: false,
    user: null,
    roles: []
  }),
  getters: {
    isAuth(): boolean {
      return this.auth
    },
    getUser(): any {
      return this.user
    },
    getRoles(): string[] {
      return this.roles
    }
  },
  actions: {
    async getProfile() {
      try {
        const { data } = await CHECK_AUTH()
        this.auth = true
        this.user = data
        data.roleDTO.roleCategoryDTOS.map((role: any) => {
          if (role.privilage) {
            let roleName = role.categoryDTO.name as never
            this.roles.push(rolesName[roleName] || '')
          }
        })
      } catch (error) {
        console.error(error)
				this.logOut()
      }
    },
    logOut() {
      this.user = null
      this.auth = false
      const { cookies } = useCookies()
      cookies.remove('Authorization')
      router.push('/login')
    }
  }
})
