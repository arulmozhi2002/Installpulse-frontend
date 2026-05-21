<script setup>
import { Search, Filter } from 'lucide-vue-next'
import MessageCard from '../components/MessageCard.vue'

import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const messages = ref([])
const simulateText = ref('')
const isSimulating = ref(false)
let pollInterval = null

const fetchMessages = async () => {
  try {
    const res = await axios.get('https://installpulse-serverside.onrender.com/api/messages')
    messages.value = res.data
  } catch (error) {
    console.error("Failed to load messages", error)
  }
}

const simulateMsg = async () => {
  if (!simulateText.value) return
  isSimulating.value = true
  try {
    await axios.post('https://installpulse-serverside.onrender.com/api/simulate', { text: simulateText.value })
    simulateText.value = ''
    await fetchMessages()
  } catch (error) {
    console.error("Simulation failed", error)
  } finally {
    isSimulating.value = false
  }
}

onMounted(() => {
  fetchMessages()
  pollInterval = setInterval(fetchMessages, 3000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})
</script>

<template>
  <div class="h-full flex flex-col -m-6 h-[calc(100vh-4rem)]">
    <!-- Header Area -->
    <div class="p-6 border-b border-slate-700/50 bg-card z-10 shrink-0">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Live Feed</h1>
          <p class="text-sm text-slate-400 mt-1">Real-time WhatsApp messages from field teams.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1">
            <button class="px-3 py-1.5 text-sm font-medium rounded-md bg-slate-800 text-white shadow">All</button>
            <button class="px-3 py-1.5 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">Critical</button>
            <button class="px-3 py-1.5 text-sm font-medium rounded-md text-slate-400 hover:text-white hover:bg-slate-800/50 transition-colors">Pending</button>
          </div>
        </div>
      </div>
      
      <div class="flex flex-col sm:flex-row gap-4">
        <form @submit.prevent="simulateMsg" class="relative flex-1 flex gap-2 bg-slate-900/50 p-1 border border-slate-700 rounded-lg shadow-inner">
          <input 
            type="text" 
            v-model="simulateText"
            class="block w-full px-3 py-1.5 bg-transparent text-slate-300 placeholder-slate-500 focus:outline-none sm:text-sm" 
            placeholder="Simulate incoming WhatsApp message..." 
            :disabled="isSimulating"
          />
          <button type="submit" class="bg-primary hover:bg-primary/90 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors shadow" :disabled="isSimulating">
            {{ isSimulating ? 'Sending...' : 'Simulate' }}
          </button>
        </form>
        <button class="flex items-center gap-2 px-4 py-2 border border-slate-700 rounded-lg bg-slate-900/50 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
          <Filter class="w-4 h-4" />
          Filters
        </button>
      </div>
    </div>
    
    <!-- Messages Area -->
    <div class="flex-1 overflow-y-auto p-6 bg-background space-y-4">
      <MessageCard 
        v-for="msg in messages"
        :key="msg.id"
        v-bind="msg"
        class="group"
      />
      <div v-if="messages.length === 0" class="text-center py-12 text-slate-500">
        No messages yet. Use the simulator above to send a test message!
      </div>
    </div>
  </div>
</template>
