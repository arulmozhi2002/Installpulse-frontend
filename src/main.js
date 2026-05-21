import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style.css'
import App from './App.vue'
import axios from 'axios'

// Global Axios configuration for Multi-Tenant
axios.interceptors.request.use((config) => {
  const tenantId = localStorage.getItem('installpulse_tenant')
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId
  }
  return config
})

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
