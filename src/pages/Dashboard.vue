<script setup>
import { AlertCircle, CheckCircle2, Clock, Activity, MessageSquare } from 'lucide-vue-next'
import KpiCard from '../components/KpiCard.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'

const messages = ref([])
let pollInterval = null

const fetchMessages = async () => {
  try {
    const res = await axios.get('https://installpulse-serverside.onrender.com/api/messages')
    messages.value = res.data
  } catch (error) {
    console.error("Failed to load messages", error)
  }
}

onMounted(() => {
  fetchMessages()
  pollInterval = setInterval(fetchMessages, 3000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

// Compute KPIs based on real data
const criticalAlerts = computed(() => messages.value.filter(m => m.severity === 'danger').length)
const pendingInstalls = computed(() => messages.value.filter(m => m.severity === 'warning').length)
const completedToday = computed(() => messages.value.filter(m => m.severity === 'success').length)

const kpis = computed(() => [
  { title: 'Critical Alerts', value: criticalAlerts.value.toString(), trend: 0, trendText: 'vs last week', icon: AlertCircle, color: 'danger' },
  { title: 'Pending Installs', value: pendingInstalls.value.toString(), trend: 0, trendText: 'vs last week', icon: Clock, color: 'warning' },
  { title: 'Completed Today', value: completedToday.value.toString(), trend: 0, trendText: 'vs yesterday', icon: CheckCircle2, color: 'success' },
  { title: 'AI Processed', value: messages.value.length.toString(), trend: 0, trendText: 'vs yesterday', icon: Activity, color: 'primary' },
])

const recentActivity = computed(() => messages.value.slice(0, 5))

const severityClass = (severity) => {
  const map = {
    success: 'border-l-success text-success bg-success/10',
    warning: 'border-l-warning text-warning bg-warning/10',
    danger: 'border-l-danger text-danger bg-danger/10',
  }
  return map[severity]
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
        <p class="text-sm text-slate-400 mt-1">Monitor installation status and AI-classified alerts.</p>
      </div>
      <div class="flex items-center gap-3">
        <select class="bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5">
          <option>Today</option>
          <option>Yesterday</option>
          <option>Last 7 Days</option>
          <option>This Month</option>
        </select>
        <button class="bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors shadow-lg shadow-primary/20">
          Export Report
        </button>
      </div>
    </div>

    <!-- KPIs -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard 
        v-for="kpi in kpis" 
        :key="kpi.title"
        v-bind="kpi"
      />
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Activity Feed -->
      <div class="lg:col-span-2 bg-card border border-slate-700/50 rounded-xl overflow-hidden flex flex-col shadow-sm">
        <div class="px-6 py-5 border-b border-slate-700/50 flex justify-between items-center">
          <h2 class="text-lg font-semibold text-white">Recent Classified Activity</h2>
          <button class="text-sm text-primary hover:text-primary/80 font-medium">View All</button>
        </div>
        <div class="divide-y divide-slate-700/50 flex-1 overflow-y-auto">
          <div v-for="item in recentActivity" :key="item.id" class="p-6 hover:bg-slate-800/50 transition-colors">
            <div class="flex items-start gap-4">
              <div 
                class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border"
                :class="severityClass(item.severity)"
              >
                <MessageSquare class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2">
                  <p class="text-sm font-medium text-slate-200 truncate">{{ item.group }} <span class="text-slate-500 font-normal ml-1">from {{ item.sender }}</span></p>
                  <span class="text-xs text-slate-500 flex-shrink-0">{{ item.time }}</span>
                </div>
                <p class="text-sm text-slate-400 mt-1 line-clamp-2">{{ item.message }}</p>
                <div class="mt-3 flex items-center gap-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border" :class="severityClass(item.severity)">
                    AI: {{ item.aiLabel }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-if="recentActivity.length === 0" class="p-8 text-center text-slate-500">
            No activity detected yet.
          </div>
        </div>
      </div>

      <!-- Quick Stats / Charts placeholder -->
      <div class="space-y-6">
        <div class="bg-card border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-white mb-4">Severity Distribution</h2>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-success font-medium">Success</span>
                <span class="text-slate-400">{{ messages.length ? Math.round((completedToday / messages.length) * 100) : 0 }}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2">
                <div class="bg-success h-2 rounded-full" :style="{ width: `${messages.length ? (completedToday / messages.length) * 100 : 0}%` }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-warning font-medium">Pending/Delay</span>
                <span class="text-slate-400">{{ messages.length ? Math.round((pendingInstalls / messages.length) * 100) : 0 }}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2">
                <div class="bg-warning h-2 rounded-full" :style="{ width: `${messages.length ? (pendingInstalls / messages.length) * 100 : 0}%` }"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between text-sm mb-1">
                <span class="text-danger font-medium">Critical/Issues</span>
                <span class="text-slate-400">{{ messages.length ? Math.round((criticalAlerts / messages.length) * 100) : 0 }}%</span>
              </div>
              <div class="w-full bg-slate-800 rounded-full h-2">
                <div class="bg-danger h-2 rounded-full" :style="{ width: `${messages.length ? (criticalAlerts / messages.length) * 100 : 0}%` }"></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- System Status -->
        <div class="bg-card border border-slate-700/50 rounded-xl p-6 shadow-sm">
          <h2 class="text-lg font-semibold text-white mb-4">System Status</h2>
          <div class="space-y-3">
            <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-success"></div>
                <span class="text-sm font-medium text-slate-200">WhatsApp Web JS</span>
              </div>
              <span class="text-xs text-success bg-success/10 px-2 py-1 rounded">Connected</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-success"></div>
                <span class="text-sm font-medium text-slate-200">OpenAI Processor</span>
              </div>
              <span class="text-xs text-success bg-success/10 px-2 py-1 rounded">Active</span>
            </div>
            <div class="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div class="flex items-center gap-3">
                <div class="w-2 h-2 rounded-full bg-success"></div>
                <span class="text-sm font-medium text-slate-200">Supabase DB</span>
              </div>
              <span class="text-xs text-slate-400">12ms latency</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
