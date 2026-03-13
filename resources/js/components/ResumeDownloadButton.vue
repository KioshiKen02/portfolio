<template>
  <button
    type="button"
    class="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-[var(--radius-button)] bg-[var(--color-brand)] px-8 py-4 font-medium text-white shadow-lg transition-all hover:bg-[var(--color-brand-hover)] hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
    :disabled="!url"
    @click="download"
  >
    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v10m0 0l-3-3m3 3l3-3M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" />
    </svg>
    Download Resume
  </button>
</template>

<script setup>
const props = defineProps({
  url: { type: String, default: '' },
  filename: { type: String, default: 'resume.pdf' },
});

function download() {
  if (!props.url) return;
  const a = document.createElement('a');
  a.href = props.url;
  a.download = props.filename;
  a.rel = 'noopener';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  a.remove();
}
</script>
