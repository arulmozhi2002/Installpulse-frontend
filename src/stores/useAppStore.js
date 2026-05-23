import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const BASE = import.meta.env.PROD
  ? 'https://installpulse-serverside.onrender.com'
  : 'http://localhost:3000'

const api = axios.create({ baseURL: BASE })
api.interceptors.request.use(config => {
  const tenantId = localStorage.getItem('pulse_tenant')
  if (tenantId) config.headers['x-tenant-id'] = tenantId
  return config
})

export const useAppStore = defineStore('app', () => {
  const messages = ref([])
  const status = ref('disconnected')
  const qrText = ref(null)
  const phoneNumber = ref('')

  let statusTimer = null
  let messagesInterval = null
  let statusSubscribers = 0
  let messagesSubscribers = 0

  const fetchMessages = async () => {
    if (status.value !== 'connected') {
      messages.value = []
      return
    }
    try {
      const res = await api.get('/api/messages')
      messages.value = res.data
    } catch (e) {}
  }

  const fetchStatus = async () => {
    try {
      const res = await api.get('/api/status')
      status.value = res.data.status
      qrText.value = res.data.qr
      phoneNumber.value = res.data.number || ''
    } catch (e) {}
  }

  const requestPairingCode = async (phoneNumber) => {
    const res = await api.post('/api/pair', { phoneNumber })
    return res.data.code
  }

  const simulate = async (text) => {
    await api.post('/api/simulate', { text })
    await fetchMessages()
  }

  const logout = async () => {
    await api.post('/api/logout')
    status.value = 'disconnected'
    qrText.value = null
    phoneNumber.value = ''
    messages.value = []
    await fetchStatus()
  }

  // Returns a cleanup function — call it in onUnmounted
  const startStatusPolling = () => {
    statusSubscribers++
    if (statusSubscribers === 1) {
      const tick = async () => {
        const prev = status.value
        await fetchStatus()
        // Load messages when connected, clear them when disconnected
        if (prev !== 'connected' && status.value === 'connected') {
          fetchMessages()
        } else if (prev === 'connected' && status.value !== 'connected') {
          messages.value = []
        }
        if (statusSubscribers > 0) {
          // Poll fast while waiting for QR scan, slow once connected
          const delay = status.value === 'connected' ? 8000 : 2000
          statusTimer = setTimeout(tick, delay)
        }
      }
      tick()
    }
    return () => {
      statusSubscribers--
      if (statusSubscribers === 0 && statusTimer) {
        clearTimeout(statusTimer)
        statusTimer = null
      }
    }
  }

  const startMessagesPolling = () => {
    messagesSubscribers++
    if (messagesSubscribers === 1) {
      fetchMessages()
      messagesInterval = setInterval(fetchMessages, 3000)
    }
    return () => {
      messagesSubscribers--
      if (messagesSubscribers === 0 && messagesInterval) {
        clearInterval(messagesInterval)
        messagesInterval = null
      }
    }
  }

  return {
    messages,
    status,
    qrText,
    phoneNumber,
    fetchMessages,
    fetchStatus,
    simulate,
    logout,
    requestPairingCode,
    startStatusPolling,
    startMessagesPolling,
  }
})
