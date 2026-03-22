import { ref, computed } from 'vue';

const isLoading = ref(false);
const state = ref('idle'); // 'idle', 'loading', 'success', 'error'
const progress = ref(0);
const startTime = ref(0);
const MIN_DURATION = 300;
const SUCCESS_DURATION = 1500;
const ERROR_DURATION = 2000;

export function useLoading() {
  const showLoading = () => {
    isLoading.value = true;
    state.value = 'loading';
    progress.value = 0;
    startTime.value = Date.now();
  };

  const setProgress = (value) => {
    const next = Math.max(0, Math.min(100, Number(value)));
    if (!Number.isFinite(next)) return;
    progress.value = next;
  };

  const hideLoading = async (finalState = 'idle') => {
    const elapsed = Date.now() - startTime.value;
    const remaining = Math.max(0, MIN_DURATION - elapsed);
    
    if (remaining > 0) {
      await new Promise(resolve => setTimeout(resolve, remaining));
    }

    if (finalState === 'success' || finalState === 'error') {
      state.value = finalState;
      progress.value = 100;
      const displayDuration = finalState === 'success' ? SUCCESS_DURATION : ERROR_DURATION;
      await new Promise(resolve => setTimeout(resolve, displayDuration));
    }
    
    isLoading.value = false;
    state.value = 'idle';
    progress.value = 0;
  };

  return {
    isLoading: computed(() => isLoading.value),
    state: computed(() => state.value),
    progress: computed(() => progress.value),
    showLoading,
    setProgress,
    hideLoading
  };
}
