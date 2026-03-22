import { ref, computed } from 'vue';

const isLoading = ref(false);
const state = ref('idle'); // 'idle', 'loading', 'success', 'error'
const startTime = ref(0);
const MIN_DURATION = 300;
const SUCCESS_DURATION = 1500;
const ERROR_DURATION = 2000;

export function useLoading() {
  const showLoading = () => {
    isLoading.value = true;
    state.value = 'loading';
    startTime.value = Date.now();
  };

  const hideLoading = async (finalState = 'idle') => {
    const elapsed = Date.now() - startTime.value;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    if (finalState === 'success' || finalState === 'error') {
      state.value = finalState;
      const displayDuration = finalState === 'success' ? SUCCESS_DURATION : ERROR_DURATION;
      await new Promise(resolve => setTimeout(resolve, displayDuration));
    }
    
    isLoading.value = false;
    state.value = 'idle';
  };

  return {
    isLoading: computed(() => isLoading.value),
    state: computed(() => state.value),
    showLoading,
    hideLoading
  };
}
