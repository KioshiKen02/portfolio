import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

export type AdminTab = 'dashboard' | 'projects' | 'skills' | 'timeline' | 'certificates' | 'settings' | 'contacts';

export function useAdminDashboard() {
  const route = useRoute();
  const router = useRouter();
  
  // Use URL state persistence for tabs
  const currentTab = computed({
    get: () => (route.query.tab as AdminTab) || 'dashboard',
    set: (val: AdminTab) => router.push({ query: { ...route.query, tab: val } }),
  });

  const sidebarOpen = ref(false);
  const toasts = ref<Array<{ id: number; message: string; type: 'success' | 'error' | 'info'; icon: any }>>([]);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success', icon: any = null) => {
    const id = Date.now();
    toasts.value.push({ id, message, type, icon });
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  };

  return {
    currentTab,
    sidebarOpen,
    toasts,
    addToast,
    removeToast,
  };
}
