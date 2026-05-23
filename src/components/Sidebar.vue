<script setup>
import {
  LayoutDashboard,
  MessageSquare,
  Cpu,
  Smartphone,
  LogOut,
  Activity
} from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'
import { computed, onMounted, onUnmounted } from 'vue'
import { useAppStore } from '../stores/useAppStore'

const route = useRoute()
const router = useRouter()
const store = useAppStore()

const phoneNumber = computed(() =>
  store.status === 'connected' ? (store.phoneNumber || 'Device Connected') : 'Not connected'
)

const handleLogout = () => {
  localStorage.removeItem('pulse_auth')
  router.push('/')
}

let stopPolling = null
onMounted(() => { stopPolling = store.startStatusPolling() })
onUnmounted(() => { stopPolling?.() })

const navigation = [
  { name: 'Connect WhatsApp', path: '/app/connect', icon: Smartphone },
  { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { name: 'Live Feed', path: '/app/feed', icon: MessageSquare },
  { name: 'Rules Config', path: '/app/rules', icon: Cpu }
]
</script>

<template>
  <aside class="w-64 bg-card border-r border-slate-700/50 hidden md:flex flex-col">
    <!-- Brand -->
    <div class="h-16 flex items-center px-6 border-b border-slate-700/50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
          <Activity class="w-5 h-5 text-primary" />
        </div>
        <span class="text-xl font-bold tracking-tight text-white">Pulse</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <router-link
        v-for="item in navigation"
        :key="item.name"
        :to="item.path"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
        :class="[
          route.path === item.path 
            ? 'bg-primary/10 text-primary font-medium' 
            : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
        ]"
      >
        <component 
          :is="item.icon" 
          class="w-5 h-5 transition-colors"
          :class="[route.path === item.path ? 'text-primary' : 'text-slate-400 group-hover:text-slate-300']"
        />
        {{ item.name }}
      </router-link>

      <div class="pt-4 mt-4 border-t border-slate-700/50">
        <button 
          @click="handleLogout"
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 group"
        >
          <LogOut class="w-5 h-5 transition-colors group-hover:text-red-400" />
          <span class="font-medium">Logout</span>
        </button>
      </div>
    </nav>
    
    <!-- User / Connection Status -->
    <div class="p-4 border-t border-slate-700/50">
      <div class="bg-slate-800 rounded-lg p-3 flex items-center gap-3 border border-slate-700">
        <div class="w-2 h-2 rounded-full animate-pulse" :class="phoneNumber !== 'Not connected' && phoneNumber !== '' ? 'bg-success' : 'bg-slate-500'"></div>
        <div class="flex-1 truncate">
          <p class="text-sm font-medium text-slate-200">WhatsApp Engine</p>
          <p class="text-xs text-slate-400 truncate">{{ phoneNumber || 'Initializing...' }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>

