<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: String,
  value: [String, Number],
  icon: Object,
  trend: Number, // positive or negative
  trendText: String,
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger'].includes(value)
  }
})

const colorClasses = computed(() => {
  const map = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    success: 'text-success bg-success/10 border-success/20',
    warning: 'text-warning bg-warning/10 border-warning/20',
    danger: 'text-danger bg-danger/10 border-danger/20',
  }
  return map[props.color] || map.primary
})

const iconColorClass = computed(() => {
  const map = {
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
  }
  return map[props.color] || map.primary
})
</script>

<template>
  <div class="bg-card rounded-xl p-5 border border-slate-700/50 shadow-sm hover:shadow-md hover:border-slate-600 transition-all duration-200 group">
    <div class="flex items-center justify-between">
      <div class="space-y-1">
        <p class="text-sm font-medium text-slate-400">{{ title }}</p>
        <p class="text-2xl font-bold text-white">{{ value }}</p>
      </div>
      <div 
        class="w-12 h-12 rounded-lg flex items-center justify-center border transition-transform group-hover:scale-110"
        :class="colorClasses"
      >
        <component :is="icon" class="w-6 h-6" :class="iconColorClass" />
      </div>
    </div>
    <div class="mt-4 flex items-center text-sm" v-if="trend !== undefined">
      <span 
        class="font-medium flex items-center gap-1"
        :class="trend >= 0 ? 'text-success' : 'text-danger'"
      >
        <svg v-if="trend >= 0" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
        {{ Math.abs(trend) }}%
      </span>
      <span class="ml-2 text-slate-500">{{ trendText }}</span>
    </div>
  </div>
</template>
