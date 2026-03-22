<script setup lang="ts">
import { 
  LayoutDashboard, 
  FolderKanban, 
  Wrench, 
  History, 
  Award, 
  Settings, 
  Mail, 
  Menu, 
  X, 
  LogOut, 
  Sun, 
  Moon, 
  User as UserIcon,
  CheckCircle,
  Info
} from 'lucide-vue-next';
import { useAdminDashboard, type AdminTab } from '@/composables/admin/useAdminDashboard';
import { useAdminAuth } from '@/composables/admin/useAdminAuth';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';

const { currentTab, sidebarOpen, toasts, removeToast } = useAdminDashboard();
const { user, handleLogout } = useAdminAuth();

const isDarkTheme = ref(false);

const syncThemeState = () => {
  isDarkTheme.value = document.documentElement.classList.contains('dark');
};

const toggleTheme = () => {
  const isDark = document.documentElement.classList.toggle('dark');
  isDarkTheme.value = isDark;
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
};

onMounted(() => {
  syncThemeState();
});

const tabs: Array<{ id: AdminTab; label: string; icon: any }> = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'timeline', label: 'Timeline', icon: History },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'contacts', label: 'Contacts', icon: Mail },
  { id: 'settings', label: 'Settings', icon: Settings },
];
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
    <!-- Toast Notifications -->
    <div class="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md transition-all duration-300"
          :class="{
            'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/90 dark:text-emerald-200': toast.type === 'success',
            'border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800 dark:bg-rose-900/90 dark:text-rose-200': toast.type === 'error',
            'border-blue-200 bg-blue-50/90 text-blue-800 dark:border-blue-800 dark:bg-blue-900/90 dark:text-blue-200': toast.type === 'info'
          }"
        >
          <component :is="toast.icon || (toast.type === 'success' ? CheckCircle : Info)" class="h-5 w-5 flex-shrink-0" />
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button @click="removeToast(toast.id)" class="ml-2 opacity-70 hover:opacity-100 transition-opacity">
            <X class="h-4 w-4" />
          </button>
        </div>
      </transition-group>
    </div>

    <div class="flex h-screen overflow-hidden">
      <!-- Sidebar Desktop -->
      <aside class="hidden lg:flex flex-col w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-sm">
        <div class="p-6 flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <LayoutDashboard class="h-6 w-6" />
          </div>
          <div class="leading-tight">
            <h2 class="font-bold text-slate-900 dark:text-white">Admin Console</h2>
            <p class="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Enterprise Management</p>
          </div>
        </div>

        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="currentTab = tab.id"
            class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200"
            :class="currentTab === tab.id 
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
              : 'text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'"
          >
            <component 
              :is="tab.icon" 
              class="h-5 w-5"
              :class="currentTab === tab.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'"
            />
            {{ tab.label }}
          </button>
        </nav>

        <div class="p-6 border-t border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-4">
            <div class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
              <UserIcon class="h-5 w-5" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ user?.name }}</p>
              <p class="text-[10px] text-slate-500 dark:text-slate-400 truncate font-bold uppercase tracking-widest">Administrator</p>
            </div>
            <button 
              @click="handleLogout"
              class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
            >
              <LogOut class="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile Sidebar Overlay -->
      <transition name="fade">
        <div 
          v-if="sidebarOpen" 
          @click="sidebarOpen = false" 
          class="fixed inset-0 z-[60] bg-slate-900/50 backdrop-blur-sm lg:hidden"
        ></div>
      </transition>

      <!-- Mobile Sidebar -->
      <transition name="slide">
        <aside 
          v-if="sidebarOpen" 
          class="fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 shadow-2xl lg:hidden flex flex-col transition-all duration-300"
        >
          <div class="p-6 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <LayoutDashboard class="h-6 w-6" />
              </div>
              <h2 class="font-bold text-slate-900 dark:text-white">Admin</h2>
            </div>
            <button @click="sidebarOpen = false" class="p-2 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X class="h-5 w-5" />
            </button>
          </div>
          
          <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="currentTab = tab.id; sidebarOpen = false"
              class="group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200"
              :class="currentTab === tab.id 
                ? 'bg-indigo-600 text-white' 
                : 'text-slate-600 dark:text-slate-400'"
            >
              <component :is="tab.icon" class="h-5 w-5" />
              {{ tab.label }}
            </button>
          </nav>
        </aside>
      </transition>

      <!-- Main Content -->
      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <!-- Header -->
        <header class="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between z-50 transition-colors duration-300">
          <div class="flex items-center gap-4">
            <button @click="sidebarOpen = true" class="lg:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
              <Menu class="h-6 w-6" />
            </button>
            <h1 class="text-xl font-black text-slate-900 dark:text-white hidden sm:block tracking-tight">
              {{ tabs.find(t => t.id === currentTab)?.label }}
            </h1>
          </div>

          <div class="flex items-center gap-4">
            <button 
              @click="toggleTheme" 
              class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200"
              :title="isDarkTheme ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
            >
              <Sun v-if="isDarkTheme" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </button>
            <div class="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <div class="flex items-center gap-3">
              <div class="text-right hidden md:block leading-none">
                <p class="text-sm font-black text-slate-900 dark:text-white">{{ user?.name }}</p>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">Administrator</span>
              </div>
              <div class="h-10 w-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black shadow-inner border border-indigo-200/50 dark:border-indigo-800/50">
                {{ user?.name.charAt(0).toUpperCase() }}
              </div>
            </div>
          </div>
        </header>

        <!-- View Content -->
        <main class="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-6 sm:p-10 custom-scrollbar transition-colors duration-300">
          <div class="max-w-7xl mx-auto h-full">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateX(30px) scale(0.9); }
.toast-leave-to { opacity: 0; transform: translateX(30px); }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(-100%); }

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #334155; }
</style>
