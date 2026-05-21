<script setup>
import Sidebar from '../components/Sidebar.vue'
import TopNavbar from '../components/TopNavbar.vue'
</script>

<template>
  <div class="flex h-screen bg-background overflow-hidden">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Main Content -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <TopNavbar />
      
      <!-- Page Content -->
      <main class="flex-1 overflow-y-auto p-6 scroll-smooth">
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>
