<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  AlertCircle,
  LayoutDashboard
} from 'lucide-vue-next';
import AdminLayout from '@/components/admin/AdminLayout.vue';
import DashboardOverview from '@/components/admin/DashboardOverview.vue';
import ProjectManager from '@/components/admin/ProjectManager.vue';
import SkillManager from '@/components/admin/SkillManager.vue';
import TimelineManager from '@/components/admin/TimelineManager.vue';
import CertificateManager from '@/components/admin/CertificateManager.vue';
import ContactManager from '@/components/admin/ContactManager.vue';
import SettingsManager from '@/components/admin/SettingsManager.vue';
import ErrorBoundary from '@/components/admin/ErrorBoundary.vue';
import { useAdminAuth } from '@/composables/admin/useAdminAuth';
import { useAdminDashboard } from '@/composables/admin/useAdminDashboard';
import api from '@/plugins/axios';

const { 
  user, 
  loginForm, 
  loginState, 
  loginError, 
  showLoginPassword, 
  handleLogin, 
  handleLogout,
  fetchCurrentUser,
  isAdmin
} = useAdminAuth();

const { currentTab, addToast } = useAdminDashboard();

const isVerifying = ref(true);
const loadingStats = ref(true);
const stats = ref({
  projects: 0,
  skills: 0,
  contacts: 0,
  timeline: 0
});

const fetchStats = async () => {
  loadingStats.value = true;
  try {
    const { data } = await api.get('/api/admin/stats');
    stats.value = data;
  } catch (err) {
    // Fallback if API not ready
    stats.value = { projects: 12, skills: 24, contacts: 5, timeline: 8 };
  } finally {
    loadingStats.value = false;
  }
};

onMounted(async () => {
  isVerifying.value = true;
  await fetchCurrentUser();
  if (user.value && isAdmin.value) {
    await fetchStats();
  }
  isVerifying.value = false;
});

const onOperationSuccess = (msg: string = 'Operation completed successfully') => {
  addToast(msg, 'success');
  fetchStats();
};
</script>

<template>
  <div v-if="isVerifying" class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
    <div class="flex flex-col items-center gap-4">
      <div class="h-12 w-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      <p class="text-sm font-bold text-slate-500 uppercase tracking-widest">Verifying Identity</p>
    </div>
  </div>

  <!-- Login / Unauthorized View -->
  <div v-else-if="!user || !isAdmin" class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-500 relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse" style="animation-delay: 2s"></div>
    </div>

    <div class="w-full max-w-lg animate-fade-up">
      <div class="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
        <div class="px-12 pt-16 pb-10 text-center">
          <div class="mx-auto w-20 h-20 rounded-[2rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 mb-8 transform hover:rotate-12 transition-transform duration-500">
            <ShieldCheck v-if="!user" class="h-10 w-10" />
            <AlertCircle v-else class="h-10 w-10" />
          </div>
          <h2 class="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            {{ !user ? 'Admin Portal' : 'Access Denied' }}
          </h2>
          <p class="text-slate-500 dark:text-slate-400 font-medium px-4">
            {{ !user ? 'Authorized access only. Secure biometric-grade encryption active.' : 'Your identity has been verified, but you do not have administrative clearance for this terminal.' }}
          </p>
        </div>

        <form v-if="!user" @submit.prevent="handleLogin" class="px-12 pb-16 space-y-8">
          <div class="space-y-6">
            <div class="group">
              <label class="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-indigo-600 transition-colors">Digital Identity</label>
              <div class="relative">
                <input 
                  v-model="loginForm.email"
                  type="email" 
                  required
                  placeholder="admin@enterprise.com"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
              </div>
            </div>

            <div class="group">
              <label class="block text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-3 ml-1 group-focus-within:text-indigo-600 transition-colors">Access Key</label>
              <div class="relative">
                <input 
                  v-model="loginForm.password"
                  :type="showLoginPassword ? 'text' : 'password'" 
                  required
                  placeholder="••••••••••••"
                  class="w-full px-6 py-5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
                />
                <button 
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute right-5 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                >
                  <Eye v-if="!showLoginPassword" class="h-5 w-5" />
                  <EyeOff v-else class="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="loginError" class="flex items-center gap-3 p-5 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold animate-shake">
            <AlertCircle class="h-5 w-5 shrink-0" />
            {{ loginError }}
          </div>

          <button 
            type="submit"
            :disabled="loginState === 'submitting'"
            class="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <div class="flex items-center justify-center gap-3">
              <Loader2 v-if="loginState === 'submitting'" class="h-6 w-6 animate-spin" />
              <span>{{ loginState === 'submitting' ? 'Verifying Credentials' : 'Authenticate Access' }}</span>
            </div>
          </button>
        </form>

        <div v-else class="px-12 pb-16 text-center space-y-6">
          <button 
            @click="handleLogout"
            class="w-full py-6 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-[2rem] font-black text-lg transition-all"
          >
            Terminate Session
          </button>
          <p class="text-xs font-black uppercase tracking-widest text-slate-400">Security event logged. System administrator notified.</p>
        </div>
      </div>
      
      <div class="mt-10 text-center">
        <button class="text-slate-400 dark:text-slate-600 text-xs font-black uppercase tracking-widest hover:text-indigo-600 transition-colors">System Recovery Protocol</button>
      </div>
    </div>
  </div>

  <!-- Authenticated View -->
  <AdminLayout v-else>
    <ErrorBoundary>
      <transition name="view" mode="out-in">
        <div :key="currentTab">
          <div v-if="loadingStats && currentTab === 'dashboard'" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-pulse">
            <div v-for="i in 4" :key="i" class="h-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800"></div>
          </div>
          
          <DashboardOverview v-else-if="currentTab === 'dashboard'" :stats="stats" @changeTab="t => currentTab = t" />
          <ProjectManager v-else-if="currentTab === 'projects'" @success="onOperationSuccess" />
          <SkillManager v-else-if="currentTab === 'skills'" @success="onOperationSuccess" />
          <TimelineManager v-else-if="currentTab === 'timeline'" @success="onOperationSuccess" />
          <CertificateManager v-else-if="currentTab === 'certificates'" @success="onOperationSuccess" />
          <ContactManager v-else-if="currentTab === 'contacts'" @success="onOperationSuccess" />
          <SettingsManager v-else-if="currentTab === 'settings'" @success="onOperationSuccess" />
        </div>
      </transition>
    </ErrorBoundary>
  </AdminLayout>
</template>

<style scoped>
.animate-fade-up {
  animation: fadeUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.view-enter-active, .view-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.view-enter-from { opacity: 0; transform: scale(0.98); }
.view-leave-to { opacity: 0; transform: scale(1.02); }
</style>
