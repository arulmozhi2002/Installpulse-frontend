<script setup>
import { Plus, Trash2, Search, X } from 'lucide-vue-next'
import { ref, onMounted } from 'vue'
import axios from 'axios'

const rules = ref([])
const showAddModal = ref(false)
const newRule = ref({ keyword: '', severity: 'success', active: true })

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/rules')
    rules.value = res.data
  } catch (error) {
    console.error("Failed to load rules", error)
  }
})

const saveRules = async () => {
  try {
    await axios.post('http://localhost:3000/api/rules', { rules: rules.value })
  } catch (error) {
    console.error("Failed to save rules", error)
  }
}

const toggleRule = async (rule) => {
  rule.active = !rule.active
  await saveRules()
}

const deleteRule = async (index) => {
  rules.value.splice(index, 1)
  await saveRules()
}

const addRule = async () => {
  if (!newRule.value.keyword.trim()) return
  rules.value.push({
    id: Date.now(),
    keyword: newRule.value.keyword.trim(),
    severity: newRule.value.severity,
    active: true
  })
  await saveRules()
  showAddModal.value = false
  newRule.value.keyword = ''
}


const severityColors = {
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  danger: 'bg-danger/10 text-danger border-danger/20',
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-white tracking-tight">Classification Rules</h1>
        <p class="text-sm text-slate-400 mt-1">Configure keyword triggers and AI behavior for incoming messages.</p>
      </div>
      <button @click="showAddModal = true" class="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
        <Plus class="w-4 h-4" />
        Add New Rule
      </button>
    </div>

    <!-- Add Rule Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-card border border-slate-700 rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
        <div class="p-4 border-b border-slate-700/50 flex justify-between items-center">
          <h3 class="font-bold text-white">Add New Rule</h3>
          <button @click="showAddModal = false" class="text-slate-400 hover:text-white"><X class="w-5 h-5"/></button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Keyword / Phrase</label>
            <input v-model="newRule.keyword" type="text" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary" placeholder="e.g. broken cable" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-300 mb-1">Severity</label>
            <select v-model="newRule.severity" class="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-primary">
              <option value="success">Success (Green)</option>
              <option value="warning">Warning (Yellow)</option>
              <option value="danger">Critical (Red)</option>
            </select>
          </div>
          <button @click="addRule" class="w-full bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-4">Save Rule</button>
        </div>
      </div>
    </div>

    <div class="bg-card border border-slate-700/50 rounded-xl overflow-hidden shadow-sm">
      <div class="p-4 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/20">
        <div class="relative max-w-sm w-full">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search class="h-4 w-4 text-slate-500" />
          </div>
          <input 
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:border-primary sm:text-sm" 
            placeholder="Search rules..." 
          />
        </div>
      </div>
      
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm text-slate-300">
          <thead class="text-xs uppercase bg-slate-800/50 text-slate-400 border-b border-slate-700/50">
            <tr>
              <th scope="col" class="px-6 py-4 font-semibold">Keyword / Phrase</th>
              <th scope="col" class="px-6 py-4 font-semibold">Severity</th>
              <th scope="col" class="px-6 py-4 font-semibold text-center">Semantic AI Match</th>
              <th scope="col" class="px-6 py-4 font-semibold text-center">Status</th>
              <th scope="col" class="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-700/50">
            <tr v-for="(rule, index) in rules" :key="rule.id" class="hover:bg-slate-800/30 transition-colors">
              <td class="px-6 py-4 font-medium text-white">
                "{{ rule.keyword }}"
              </td>
              <td class="px-6 py-4">
                <span class="px-2.5 py-1 rounded-md text-xs font-medium border capitalize" :class="severityColors[rule.severity]">
                  {{ rule.severity }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span v-if="rule.ai_match" class="inline-flex items-center gap-1 text-primary text-xs font-medium bg-primary/10 px-2 py-1 rounded border border-primary/20">
                  Enabled
                </span>
                <span v-else class="text-slate-500 text-xs">Exact match only</span>
              </td>
              <td class="px-6 py-4 text-center">
                <button 
                  @click="toggleRule(rule)"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                  :class="rule.active ? 'bg-primary' : 'bg-slate-600'"
                >
                  <span 
                    class="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                    :class="rule.active ? 'translate-x-5' : 'translate-x-1'"
                  />
                </button>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="deleteRule(index)" class="p-1.5 text-slate-400 hover:text-danger bg-slate-800 hover:bg-slate-700 rounded transition-colors">
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Empty State handling (optional) -->
      <div v-if="rules.length === 0" class="p-12 text-center">
        <p class="text-slate-400">No rules configured yet.</p>
      </div>
    </div>
  </div>
</template>
