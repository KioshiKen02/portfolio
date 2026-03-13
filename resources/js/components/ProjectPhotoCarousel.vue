<template>
  <div
    class="relative h-full w-full select-none overflow-hidden"
    @mouseenter="paused = true"
    @mouseleave="paused = false"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
    @pointercancel="onPointerUp"
  >
    <div v-if="!images.length" class="flex h-full w-full items-center justify-center text-slate-400">
      <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </div>

    <div v-else class="absolute inset-0">
      <div class="absolute inset-0 bg-slate-200/60 dark:bg-slate-800/60" :class="loaded[current] ? 'opacity-0' : 'opacity-100 animate-pulse'" style="transition: opacity 300ms ease"></div>
      <img
        :src="images[current]"
        :alt="altText(current)"
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover"
        :class="loaded[current] ? 'opacity-100' : 'opacity-0'"
        style="transition: opacity 420ms cubic-bezier(0.22, 1, 0.36, 1)"
        @load="markLoaded(current)"
        @error="markLoaded(current)"
      />
    </div>

    <div v-if="images.length > 1" class="pointer-events-none absolute inset-x-0 bottom-0 p-3">
      <div class="flex items-center justify-between">
        <div class="rounded-full bg-slate-950/60 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur">
          {{ current + 1 }} of {{ images.length }}
        </div>
        <div class="pointer-events-auto flex items-center gap-1.5">
          <button
            v-for="(_, idx) in images"
            :key="idx"
            type="button"
            class="h-2 w-2 rounded-full transition"
            :class="idx === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'"
            :aria-label="`Go to photo ${idx + 1}`"
            @click.stop="goTo(idx)"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  images: { type: Array, default: () => [] },
  title: { type: String, default: 'Project' },
  autoplayMs: { type: Number, default: 3600 },
});

const current = ref(0);
const paused = ref(false);
const loaded = ref({});
let timer = 0;

const reducedMotion = typeof window !== 'undefined'
  ? window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  : false;

function altText(idx) {
  return `${props.title} photo ${idx + 1}`;
}

function markLoaded(idx) {
  loaded.value = { ...loaded.value, [idx]: true };
}

function goTo(idx) {
  current.value = idx;
}

function next() {
  if (!props.images.length) return;
  current.value = (current.value + 1) % props.images.length;
}

function start() {
  stop();
  if (reducedMotion) return;
  timer = window.setInterval(() => {
    if (!paused.value && props.images.length > 1) next();
  }, props.autoplayMs);
}

function stop() {
  if (timer) window.clearInterval(timer);
  timer = 0;
}

let pointerDownX = 0;
let swiping = false;

function onPointerDown(e) {
  if (e.pointerType === 'mouse') return;
  pointerDownX = e.clientX;
  swiping = true;
}

function onPointerMove(e) {
  if (!swiping) return;
  const dx = e.clientX - pointerDownX;
  if (Math.abs(dx) < 48) return;
  swiping = false;
  if (dx < 0) next();
  else current.value = (current.value - 1 + props.images.length) % props.images.length;
}

function onPointerUp() {
  swiping = false;
}

watch(
  () => props.images,
  () => {
    current.value = 0;
    loaded.value = {};
    start();
  },
  { deep: true }
);

onMounted(() => start());
onBeforeUnmount(() => stop());
</script>

