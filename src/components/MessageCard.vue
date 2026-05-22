<script setup>
import { computed } from 'vue'
import { AlertCircle, CheckCircle2, Clock, MapPin, Wrench } from 'lucide-vue-next'

const props = defineProps({
  sender: String,
  senderDp: String,
  group: String,
  message: String,
  time: String,
  severity: {
    type: String,
    validator: (v) => ['success', 'warning', 'danger'].includes(v)
  },
  aiLabel: String,
  confidence: Number
})

const severityConfig = computed(() => {
  const config = {
    success: {
      border: 'border-l-success',
      bg: 'bg-success/10',
      text: 'text-success',
      icon: CheckCircle2
    },
    warning: {
      border: 'border-l-warning',
      bg: 'bg-warning/10',
      text: 'text-warning',
      icon: Clock
    },
    danger: {
      border: 'border-l-danger',
      bg: 'bg-danger/10',
      text: 'text-danger',
      icon: AlertCircle
    }
  }
  return config[props.severity]
})
</script>

<template>
  <div class="bg-card border-y border-r border-slate-700/50 rounded-r-xl border-l-4 p-5 hover:bg-slate-800/50 transition-all duration-200 shadow-sm" :class="severityConfig.border">
    <div class="flex justify-between items-start gap-4 mb-3">
      <div class="flex items-center gap-3">
        <img v-if="senderDp" :src="senderDp" class="w-10 h-10 rounded-full object-cover shrink-0" />
        <div v-else class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 font-medium shrink-0">
          {{ sender.charAt(0) }}
        </div>
        <div>
          <h3 class="font-medium text-slate-200">{{ sender }}</h3>
          <p class="text-xs text-slate-400 flex items-center gap-1">
            <MapPin class="w-3 h-3" /> {{ group }}
          </p>
        </div>
      </div>
      <span class="text-xs text-slate-500">{{ time }}</span>
    </div>
    
    <div class="pl-13 text-slate-300 mb-4 ml-13" style="margin-left: 52px;">
      <p class="leading-relaxed">{{ message }}</p>
    </div>
    
    <div class="flex items-center justify-between ml-13 mt-4 pt-3 border-t border-slate-700/50" style="margin-left: 52px;">
      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border" :class="[severityConfig.text, severityConfig.bg, `border-${severity}/20`]">
          <component :is="severityConfig.icon" class="w-3.5 h-3.5" />
          {{ aiLabel }}
        </span>
        <span class="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
          {{ confidence }}% confidence
        </span>
      </div>
      <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button class="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors">
          <Wrench class="w-4 h-4" />
        </button>
      </div>
    </div>
  </div>
</template>
