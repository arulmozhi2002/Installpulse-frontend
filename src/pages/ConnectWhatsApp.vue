<script setup>
import { Smartphone, Check, Loader2, MessageSquare, RefreshCw, Phone } from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'

const store = useAppStore()

const status = computed(() => store.status)
const qrText = computed(() => store.qrText)
const phoneNumber = computed(() => store.phoneNumber)
const recentMessages = computed(() => store.messages.slice(0, 4))
const isLoggingOut = ref(false)

// Pairing code state
const showPairForm = ref(false)
const pairPhone = ref('')
const pairCode = ref('')
const pairLoading = ref(false)
const pairError = ref('')

const qrImageUrl = computed(() => {
  if (!qrText.value) return null
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrText.value)}`
})

const handleLogout = async () => {
  isLoggingOut.value = true
  pairCode.value = ''
  pairError.value = ''
  showPairForm.value = false
  await store.logout().catch(() => {})
  isLoggingOut.value = false
}

const handlePairRequest = async () => {
  if (!pairPhone.value) return
  pairLoading.value = true
  pairError.value = ''
  pairCode.value = ''
  try {
    const code = await store.requestPairingCode(pairPhone.value)
    pairCode.value = code
  } catch (e) {
    pairError.value = e?.response?.data?.error || e.message || 'Failed to get code'
  } finally {
    pairLoading.value = false
  }
}

let stopStatusPolling = null
let stopMessagesPolling = null
onMounted(() => {
  stopStatusPolling = store.startStatusPolling()
  stopMessagesPolling = store.startMessagesPolling()
})
onUnmounted(() => {
  stopStatusPolling?.()
  stopMessagesPolling?.()
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
          
          <div v-if="status === 'connected'" class="flex flex-col items-center justify-center text-center w-full">
            <div class="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Check class="w-8 h-8 text-white" />
            </div>
            <h3 class="text-xl font-light text-[#41525d] mb-1">Device Connected</h3>
            <p class="text-[#8696a0] mb-6 text-sm">{{ phoneNumber || 'Active Session' }}</p>
            
            <div class="w-full text-left mb-6" v-if="recentMessages.length > 0">
                <div class="flex items-center gap-2 mb-3">
                  <MessageSquare class="w-4 h-4 text-green-500" />
                  <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Feed Preview</span>
                </div>
                <div class="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                    <div v-for="msg in recentMessages" :key="msg.id" class="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm shadow-sm">
                        <div class="flex items-start gap-2 mb-1">
                            <img v-if="msg.senderDp" :src="msg.senderDp" class="w-6 h-6 rounded-full object-cover shrink-0" />
                            <div v-else class="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                                {{ msg.sender.charAt(0).toUpperCase() }}
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center">
                                    <span class="font-medium text-gray-700 truncate pr-2">{{ msg.sender }}</span>
                                    <span class="text-[10px] text-gray-400 whitespace-nowrap">{{ msg.time }}</span>
                                </div>
                                <p class="text-gray-600 line-clamp-2 text-xs leading-relaxed mt-0.5">{{ msg.message }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <router-link to="/app/dashboard" class="w-full block bg-[#00a884] hover:bg-[#06cf9c] text-white px-8 py-3 rounded-xl font-medium transition-colors shadow-md text-center">
              Go to Full Dashboard
            </router-link>
            <button
              @click="handleLogout"
              :disabled="isLoggingOut"
              class="w-full flex items-center justify-center gap-2 mt-3 px-8 py-2.5 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoggingOut }" />
              {{ isLoggingOut ? 'Disconnecting...' : 'Disconnect / Re-scan QR' }}
            </button>
          </div>

          <div v-else class="relative min-h-[300px] flex items-center justify-center">
            <!-- Loading States -->
            <div v-if="status === 'authenticating'" class="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center text-center px-4">
              <Loader2 class="w-10 h-10 text-[#00a884] animate-spin mb-4" />
              <p class="text-[#41525d] font-medium text-lg mb-1">Connecting...</p>
              <p class="text-[#8696a0]">Restoring session, please wait...</p>
            </div>

            <div v-else-if="status === 'disconnected' && !qrText" class="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center px-6">
              <Loader2 class="w-10 h-10 text-[#00a884] animate-spin mb-4" />
              <p class="text-[#41525d] font-medium text-lg">Connecting...</p>
              <p class="text-[#8696a0] text-sm mt-1 text-center">Once ready, scan the QR or link with your phone number</p>
            </div>

            <!-- QR Code + Phone Number Option -->
            <div v-else class="flex flex-col items-center gap-4 relative z-10 w-full">
              <div v-if="!showPairForm" class="p-2 bg-white rounded-xl shadow-sm border border-gray-100">
                <img :src="qrImageUrl" alt="WhatsApp QR Code" class="w-[264px] h-[264px] object-contain" />
              </div>

              <!-- Toggle -->
              <button
                @click="showPairForm = !showPairForm; pairCode = ''; pairError = ''"
                class="flex items-center gap-2 text-sm text-[#00a884] hover:underline font-medium"
              >
                <Phone class="w-4 h-4" />
                {{ showPairForm ? 'Scan QR code instead' : 'Link with phone number instead' }}
              </button>

              <!-- Phone number form -->
              <div v-if="showPairForm" class="w-full px-2">
                <p class="text-xs text-gray-500 mb-2 text-center">Enter your number with country code (e.g. 919876543210)</p>
                <div class="flex gap-2">
                  <input
                    v-model="pairPhone"
                    type="tel"
                    placeholder="919876543210"
                    class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#00a884]"
                    :disabled="pairLoading"
                    @keyup.enter="handlePairRequest"
                  />
                  <button
                    @click="handlePairRequest"
                    :disabled="pairLoading || !pairPhone"
                    class="bg-[#00a884] text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 whitespace-nowrap"
                  >
                    {{ pairLoading ? '...' : 'Get Code' }}
                  </button>
                </div>

                <!-- Pairing code display -->
                <div v-if="pairCode" class="mt-3 bg-[#f0fdf4] border border-green-200 rounded-xl p-4 text-center">
                  <p class="text-xs text-gray-500 mb-1">Enter this code in WhatsApp</p>
                  <p class="text-3xl font-bold tracking-widest text-[#00a884]">{{ pairCode }}</p>
                  <p class="text-xs text-gray-400 mt-2">Settings → Linked Devices → Link a Device → Link with phone number</p>
                </div>

                <p v-if="pairError" class="mt-2 text-xs text-red-500 text-center">{{ pairError }}</p>
              </div>
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  </div>
</template>
