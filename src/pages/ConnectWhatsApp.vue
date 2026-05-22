<script setup>
import { Smartphone, Check, Loader2, MessageSquare, RefreshCw, Phone } from 'lucide-vue-next'
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'

const store = useAppStore()

const status = computed(() => store.status)
const phoneNumber = computed(() => store.phoneNumber)
const recentMessages = computed(() => store.messages.slice(0, 4))
const isLoggingOut = ref(false)

const pairPhone = ref('')
const pairCode = ref('')
const pairLoading = ref(false)
const pairError = ref('')

const handleLogout = async () => {
  isLoggingOut.value = true
  pairCode.value = ''
  pairError.value = ''
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
    pairError.value = e?.response?.data?.error || e.message || 'Failed to get code. Make sure the server is ready.'
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
    <div class="absolute top-0 w-full h-[222px] bg-[#00a884] z-0"></div>

    <div class="relative z-10 max-w-[1000px] mx-auto pt-10">
      <div class="flex items-center gap-3 mb-8 px-4 sm:px-0">
        <Smartphone class="w-8 h-8 text-white" />
        <span class="text-sm font-medium text-white uppercase tracking-widest">InstallPulse Web</span>
      </div>

      <div class="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">

        <!-- Left: Instructions -->
        <div class="flex-1 p-10 md:p-14">
          <h2 class="text-[28px] font-light text-[#41525d] mb-10 leading-tight">
            Use InstallPulse on your computer
          </h2>
          <ol class="space-y-6 text-[18px] text-[#3b4a54] font-light list-none p-0">
            <li class="flex items-start gap-4">
              <span class="font-medium">1.</span>
              <span>Enter your WhatsApp number with country code</span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">2.</span>
              <span>Click <strong>Get Code</strong> and copy the 8-digit code</span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">3.</span>
              <span>Open WhatsApp → <strong>Settings → Linked Devices → Link a Device</strong></span>
            </li>
            <li class="flex items-start gap-4">
              <span class="font-medium">4.</span>
              <span>Tap <strong>Link with phone number</strong> and enter the code</span>
            </li>
          </ol>
        </div>

        <!-- Right: Login Panel -->
        <div class="md:w-[400px] bg-white p-10 flex flex-col items-center justify-center relative border-l border-gray-100">

          <!-- Connected state -->
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
              <div class="space-y-2 max-h-[160px] overflow-y-auto pr-2">
                <div v-for="msg in recentMessages" :key="msg.id" class="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
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
              {{ isLoggingOut ? 'Disconnecting...' : 'Disconnect' }}
            </button>
          </div>

          <!-- Connecting / authenticating -->
          <div v-else-if="status === 'authenticating'" class="flex flex-col items-center justify-center text-center w-full">
            <Loader2 class="w-10 h-10 text-[#00a884] animate-spin mb-4" />
            <p class="text-[#41525d] font-medium text-lg mb-1">Connecting...</p>
            <p class="text-[#8696a0] text-sm">Verifying your session, please wait...</p>
          </div>

          <!-- Phone number login -->
          <div v-else class="w-full">
            <div class="flex items-center gap-2 mb-6">
              <div class="w-10 h-10 bg-[#00a884]/10 rounded-full flex items-center justify-center">
                <Phone class="w-5 h-5 text-[#00a884]" />
              </div>
              <div>
                <p class="font-semibold text-[#41525d]">Link with phone number</p>
                <p class="text-xs text-[#8696a0]">No QR scan needed</p>
              </div>
            </div>

            <div v-if="status === 'disconnected'" class="space-y-3">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">WhatsApp Number (with country code)</label>
                <input
                  v-model="pairPhone"
                  type="tel"
                  placeholder="e.g. 919876543210"
                  class="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#00a884] focus:ring-1 focus:ring-[#00a884]"
                  :disabled="pairLoading"
                  @keyup.enter="handlePairRequest"
                />
              </div>

              <button
                @click="handlePairRequest"
                :disabled="pairLoading || !pairPhone"
                class="w-full bg-[#00a884] hover:bg-[#06cf9c] text-white py-3 rounded-xl font-medium transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Loader2 v-if="pairLoading" class="w-4 h-4 animate-spin" />
                {{ pairLoading ? 'Getting code...' : 'Get Pairing Code' }}
              </button>

              <!-- Code display -->
              <div v-if="pairCode" class="bg-[#f0fdf4] border border-green-200 rounded-xl p-5 text-center mt-2">
                <p class="text-xs text-gray-500 mb-2">Enter this code in WhatsApp</p>
                <p class="text-4xl font-bold tracking-[0.3em] text-[#00a884]">{{ pairCode }}</p>
                <p class="text-xs text-gray-400 mt-3 leading-relaxed">
                  WhatsApp → Settings → Linked Devices<br/>→ Link a Device → Link with phone number
                </p>
              </div>

              <p v-if="pairError" class="text-xs text-red-500 text-center mt-1">{{ pairError }}</p>
            </div>

            <!-- Server starting up -->
            <div v-else class="flex flex-col items-center py-6">
              <Loader2 class="w-8 h-8 text-[#00a884] animate-spin mb-3" />
              <p class="text-sm text-[#8696a0] text-center">Server starting up, please wait...</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>
