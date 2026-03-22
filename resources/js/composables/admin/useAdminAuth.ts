import { ref, reactive, computed } from 'vue';
import api from '@/plugins/axios';
import { useRouter } from 'vue-router';

// Global state to ensure all components share the same auth status
const user = ref<any>(null);
const isInitialized = ref(false);

export function useAdminAuth() {
  const loginState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const loginError = ref('');
  const showLoginPassword = ref(false);
  const loginForm = reactive({
    email: '',
    password: '',
  });

  const isAuthenticated = computed(() => !!user.value);
  const isAdmin = computed(() => user.value?.is_admin);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      user.value = null;
      isInitialized.value = true;
      return;
    }

    try {
      const { data } = await api.get('/api/auth/me');
      user.value = data;
    } catch (err) {
      user.value = null;
      localStorage.removeItem('access_token');
    } finally {
      isInitialized.value = true;
    }
  };

  const handleLogin = async () => {
    loginState.value = 'submitting';
    loginError.value = '';
    try {
      // await api.get('/sanctum/csrf-cookie'); // Not using sanctum for session-based auth
      const { data } = await api.post('/api/auth/login', loginForm);
      if (data.access_token) {
        localStorage.setItem('access_token', data.access_token);
        // api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`; // Handled by interceptor
      }
      await fetchCurrentUser();
      loginState.value = 'success';
    } catch (err: any) {
      loginState.value = 'error';
      loginError.value = err.response?.data?.message || 'Authentication failed. Please check your credentials.';
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('access_token');
      user.value = null;
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return {
    user,
    loginForm,
    loginState,
    loginError,
    showLoginPassword,
    isAuthenticated,
    isAdmin,
    handleLogin,
    handleLogout,
    fetchCurrentUser,
  };
}
