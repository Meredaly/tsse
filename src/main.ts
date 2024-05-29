import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import { i18n } from '@/plugins/i18n'
import './modules'
import App from '@/App.vue'

const app = createApp(App)

const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(i18n)
app.mount('#app')
