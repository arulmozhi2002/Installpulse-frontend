<script setup>
import { Activity } from 'lucide-vue-next'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isSignUp = ref(false)
const email = ref('')
const password = ref('')
const errorMsg = ref('')

const handleAuth = () => {
  if (isSignUp.value) {
    errorMsg.value = "Sign up is disabled for this private prototype. Please sign in."
    return
  }

  // Hardcoded secure login
  if (email.value === 'admin@installpulse.com' && password.value === 'admin123') {
    localStorage.setItem('installpulse_auth', 'true')
    errorMsg.value = ''
    router.push('/app/connect')
  } else {
    errorMsg.value = "Invalid email or password"
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-background relative overflow-hidden">
    <!-- Background decorations -->
    <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
    <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-success/10 rounded-full blur-3xl opacity-50 mix-blend-screen pointer-events-none"></div>
    
    <div class="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="flex justify-center text-primary">
        <Activity class="w-12 h-12" />
      </div>
      <h2 class="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
        {{ isSignUp ? 'Create your account' : 'Sign in to InstallPulse' }}
      </h2>
      <p class="mt-2 text-center text-sm text-slate-400">
        The simplified WhatsApp Operations Dashboard
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
      <div class="bg-card py-8 px-4 shadow-2xl sm:rounded-xl sm:px-10 border border-slate-700/50">
        <form class="space-y-6" @submit.prevent="handleAuth">
          
          <div v-if="isSignUp">
            <label for="name" class="block text-sm font-medium text-slate-300">
              Full Name
            </label>
            <div class="mt-1">
              <input id="name" name="name" type="text" class="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-lg shadow-sm bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="John Doe">
            </div>
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-slate-300">
              Email address
            </label>
            <div class="mt-1">
              <input v-model="email" id="email" name="email" type="email" required class="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-lg shadow-sm bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="admin@installpulse.com">
            </div>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-300">
              Password
            </label>
            <div class="mt-1">
              <input v-model="password" id="password" name="password" type="password" required class="appearance-none block w-full px-3 py-2 border border-slate-700 rounded-lg shadow-sm bg-slate-900/50 text-white placeholder-slate-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="********">
            </div>
          </div>
          
          <div v-if="errorMsg" class="text-red-400 text-sm text-center font-medium bg-red-400/10 py-2 rounded-lg">
            {{ errorMsg }}
          </div>

          <div>
            <button type="submit" class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-primary/20 text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-card focus:ring-primary transition-colors">
              {{ isSignUp ? 'Create Account' : 'Sign in' }}
            </button>
          </div>
        </form>
        
        <div class="mt-6 text-center">
          <button @click="isSignUp = !isSignUp" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
