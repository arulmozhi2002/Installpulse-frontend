<script setup>
import { Bell, Search, Menu } from 'lucide-vue-next'
</script>

<template>
  <header class="h-16 bg-card/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-10">
    <div class="flex items-center gap-4 flex-1">
      <button class="md:hidden text-slate-400 hover:text-slate-200">
        <Menu class="w-6 h-6" />
      </button>
      
      <!-- Search -->
      <div class="relative max-w-md w-full hidden sm:block">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search class="h-4 w-4 text-slate-500" />
        </div>
        <input 
          type="text" 
          class="block w-full pl-10 pr-3 py-2 border border-slate-700 rounded-lg leading-5 bg-slate-900/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-900 focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors" 
          placeholder="Search groups, technicians, or messages..." 
        />
      </div>
    </div>
    
    <div class="flex items-center gap-4">
      <!-- Notifications -->
      <button class="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors">
        <Bell class="w-5 h-5" />
        <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-danger ring-2 ring-card"></span>
      </button>
      
      <!-- User Profile -->
      <div class="flex items-center gap-3 pl-4 border-l border-slate-700/50 cursor-pointer group">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center text-white font-medium text-sm shadow-lg shadow-primary/20">
          A
        </div>
        <div class="hidden md:block">
          <p class="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Workspace Admin</p>
          <p class="text-xs text-slate-500">Online</p>
        </div>
      </div>
    </div>
  </header>
</template>
