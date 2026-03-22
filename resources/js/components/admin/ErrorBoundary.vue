<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';

const error = ref<Error | null>(null);

onErrorCaptured((err) => {
  error.value = err;
  return false; // Prevent error from propagating further
});

const reset = () => {
  error.value = null;
  window.location.reload();
};
</script>

<template>
  <div v-if="error" class="min-h-[400px] flex items-center justify-center p-10 bg-rose-50/50 dark:bg-rose-950/10 rounded-[3rem] border border-rose-100 dark:border-rose-900/30">
    <div class="text-center space-y-6 max-w-md">
      <div class="mx-auto w-20 h-20 rounded-[2rem] bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
        <AlertTriangle class="h-10 w-10" />
      </div>
      <div>
        <h2 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">System Exception Detected</h2>
        <p class="mt-2 text-slate-500 dark:text-slate-400 font-medium">
          An unexpected error occurred within this module. Technical details have been logged for analysis.
        </p>
      </div>
      <div class="p-4 bg-white dark:bg-slate-900 rounded-2xl text-left border border-slate-100 dark:border-slate-800">
        <p class="text-[10px] font-mono text-rose-500 uppercase font-bold tracking-widest mb-1">Stack Trace Excerpt</p>
        <p class="text-xs font-mono text-slate-600 dark:text-slate-400 break-all leading-relaxed">{{ error.message }}</p>
      </div>
      <button @click="reset" class="flex items-center gap-2 mx-auto px-8 py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm hover:bg-rose-700 transition-all shadow-lg shadow-rose-600/20">
        <RefreshCw class="h-4 w-4" />
        <span>Reinitialize Module</span>
      </button>
    </div>
  </div>
  <slot v-else />
</template>
