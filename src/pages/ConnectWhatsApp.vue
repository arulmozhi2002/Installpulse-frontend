<script setup>
import { Smartphone, Check, Loader2 } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

const status = ref('disconnected')
const qrText = ref(null)
const phoneNumber = ref('')
let pollInterval = null

const checkStatus = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/status')
    status.value = res.data.status
    qrText.value = res.data.qr
    phoneNumber.value = res.data.number || ''
  } catch (error) {
    console.error("Failed to fetch WhatsApp status", error)
  }
}

onMounted(() => {
  checkStatus()
  pollInterval = setInterval(checkStatus, 2000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

const qrImageUrl = computed(() => {
  if (!qrText.value) return null
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrText.value)}`
})
</script>

<template>
  <div class="min-h-screen bg-[#f0f2f5] relative font-sans">
    <!-- Green Header Strip -->
    <div class="absolute top-0 w-full h-[222px] bg-[#00a884] z-0"></div>
    
    <div class="relative z-10 max-w-[1000px] mx-auto pt-10">
      <!-- Logo / Title Header -->
      <div class="flex items-center gap-3 mb-8 px-4 sm:px-0">
        <Smartphone class="w-8 h-8 text-white" />
        <span class="text-sm font-medium text-white uppercase tracking-widest">InstallPulse Web</span>
      </div>

      <!-- Main White Card -->
      <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
        
        <!-- Left Side: Instructions -->
        <div class="flex-1 p-10 md:p-14">
          <h2 class="text-[28px] font-light text-[#41525d] mb-10 leading-tight">
            Use InstallPulse on your computer
          </h2>
          
          <ol class="space-y-6 text-[18px] text-[#3b4a54] font-light list-none p-0 counter-reset-list">
            <li class="flex items-start gap-4">
              <span class="font-medium">1.</span>
              <span>Open WhatsApp on your phone</span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">2.</span>
              <span>Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong></span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">3.</span>
              <span>Tap on <strong>Link a device</strong></span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">4.</span>
              <span>Point your phone to this screen to capture the QR code</span>
            </li>
          </ol>
        </div>

        <!-- Right Side: QR Code Area -->
        <div class="md:w-[400px] bg-white p-10 flex flex-col items-center justify-center relative border-l border-gray-100">
          
          <div v-if="status === 'connected'" class="flex flex-col items-center justify-center text-center">
            <div class="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mb-6 shadow-lg">
              <Check class="w-10 h-10 text-white" />
            </div>
            <h3 class="text-2xl font-light text-[#41525d] mb-2">Device Connected</h3>
            <p class="text-[#8696a0] mb-8 text-lg">{{ phoneNumber || 'Initializing...' }}</p>
            <router-link to="/app/dashboard" class="bg-[#00a884] hover:bg-[#06cf9c] text-white px-8 py-3 rounded-full font-medium transition-colors shadow-md">
              Open Dashboard
            </router-link>
          </div>

          <div v-else class="relative min-h-[300px] flex items-center justify-center">
            <!-- Loading States -->
            <div v-if="status === 'authenticating'" class="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center px-4">
              <Loader2 class="w-10 h-10 text-[#00a884] animate-spin mb-4" />
              <p class="text-[#41525d] font-medium text-lg mb-1">Authenticating...</p>
              <p class="text-[#8696a0]">Syncing messages, please wait...</p>
            </div>
            
            <div v-else-if="status === 'disconnected' || !qrText" class="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center">
              <Loader2 class="w-10 h-10 text-[#00a884] animate-spin mb-4" />
              <p class="text-[#41525d] font-medium text-lg">Generating QR Code...</p>
            </div>

            <!-- The QR Code Image -->
            <div v-else class="p-2 bg-white rounded-xl shadow-sm border border-gray-100 relative z-10">
              <img :src="qrImageUrl" alt="WhatsApp QR Code" class="w-[264px] h-[264px] object-contain" />
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
</template>
