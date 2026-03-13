<template>
  <button
    type="button"
    class="inline-flex items-center justify-center gap-2 rounded-[var(--radius-button)] bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-500 hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
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

