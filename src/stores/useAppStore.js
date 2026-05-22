import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

const BASE = import.meta.env.PROD
  ? 'https://installpulse-serverside.onrender.com'
  : 'http://localhost:3000'

export const useAppStore = defineStore('app', () => {
  const messages = ref([])
  const status = ref('disconnected')
  const qrText = ref(null)
  const phoneNumber = ref('')

  let statusInterval = null
  let messagesInterval = null
  let statusSubscribers = 0
  let messagesSubscribers = 0

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE}/api/messages`)
      messages.value = res.data
    } catch (e) {}
  }

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`${BASE}/api/status`)
      status.value = res.data.status
      qrText.value = res.data.qr
      phoneNumber.value = res.data.number || ''
    } catch (e) {}
  }

  const simulate = async (text) => {
    await axios.post(`${BASE}/api/simulate`, { text })
    await fetchMessages()
  }

  // Returns a cleanup function — call it in onUnmounted
  const startStatusPolling = () => {
    statusSubscribers++
    if (statusSubscribers === 1) {
      fetchStatus()
      statusInterval = setInterval(fetchStatus, 5000)
    }
    return () => {
      statusSubscribers--
      if (statusSubscribers === 0 && statusInterval) {
        clearInterval(statusInterval)
        statusInterval = null
      }
    }
  }

  const startMessagesPolling = () => {
    messagesSubscribers++
    if (messagesSubscribers === 1) {
      fetchMessages()
      messagesInterval = setInterval(fetchMessages, 10000)
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
    simulate,
    startStatusPolling,
    startMessagesPolling,
  }
})
