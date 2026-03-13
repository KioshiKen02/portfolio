<template>
  <div class="rounded-[var(--radius-card)] border border-slate-200 bg-white/70 p-5 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-950/40">
    <div class="flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ title }}</h3>
        <p v-if="subtitle" class="mt-1 text-sm text-slate-600 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">
        {{ items.length }} roles
      </div>
    </div>

    <div class="mt-5">
      <ol class="relative pl-6">
        <div class="absolute left-[11px] top-1 bottom-1 w-px bg-slate-200 dark:bg-slate-800"></div>

        <li v-for="(item, idx) in items" :key="itemKey(item, idx)" class="relative pb-5 last:pb-0">
          <div class="absolute left-[5px] top-2 h-3 w-3 rounded-full border-2 border-indigo-500 bg-white shadow-sm dark:bg-slate-950"></div>

          <button
            type="button"
            class="card w-full text-left px-5 py-4 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            :aria-expanded="openIndex === idx"
            @click="toggle(idx)"
          >
            <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div class="min-w-0">
                <div class="text-sm font-semibold text-slate-900 dark:text-white">
                  {{ item.title }}
                </div>
                <div class="mt-1 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <span class="truncate">{{ item.company }}</span>
                  <span class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                  <span>{{ item.range }}</span>
                </div>
              </div>
              <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {{ openIndex === idx ? 'Hide' : 'Details' }}
              </div>
            </div>

            <Transition name="timeline">
              <div v-if="openIndex === idx" class="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
                <ul class="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li v-for="(b, bIdx) in item.bullets" :key="`${idx}-${bIdx}`" class="flex gap-2">
                    <span class="mt-2 h-1.5 w-1.5 flex-none rounded-full bg-indigo-500/70"></span>
                    <span class="leading-relaxed">{{ b }}</span>
                  </li>
                </ul>
              </div>
            </Transition>
          </button>
        </li>
      </ol>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Experience Timeline' },
  subtitle: { type: String, default: '' },
  items: { type: Array, default: () => [] },
});

const openIndex = ref(0);

function itemKey(item, idx) {
  return item?.id || `${item?.company || 'company'}-${item?.title || 'role'}-${idx}`;
}

function toggle(idx) {
  openIndex.value = openIndex.value === idx ? -1 : idx;
}
</script>

<style scoped>
.timeline-enter-active,
.timeline-leave-active {
  transition: opacity 200ms ease, transform 220ms cubic-bezier(0.22, 1, 0.36, 1);
}

.timeline-enter-from,
.timeline-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (prefers-reduced-motion: reduce) {
  .timeline-enter-active,
  .timeline-leave-active {
    transition: none !important;
  }
}
</style>

