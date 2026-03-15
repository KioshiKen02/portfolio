<template>
  <div class="relative w-full">
    <pre
      v-if="reserveSpace"
      aria-hidden="true"
      class="ctw-reserve m-0 whitespace-pre font-mono text-xs leading-relaxed text-transparent sm:text-sm"
    >{{ fullText }}</pre>

    <pre
      class="ctw-live m-0 whitespace-pre font-mono text-xs leading-relaxed text-slate-200 sm:text-sm"
      :class="reserveSpace ? 'absolute inset-0' : ''"
    >
      <span>{{ visibleText }}</span><span v-if="showCursor" class="ctw-cursor">|</span>
    </pre>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  loop: { type: Boolean, default: true },
  startDelayMs: { type: Number, default: 300 },
  minCharDelayMs: { type: Number, default: 18 },
  maxCharDelayMs: { type: Number, default: 62 },
  newlineDelayMs: { type: Number, default: 220 },
  pauseAfterFinishMs: { type: Number, default: 1600 },
  reserveSpace: { type: Boolean, default: true },
});

const prefersReducedMotion = ref(false);
const visibleText = ref('');
const running = ref(false);

let timer = 0;

const fullText = computed(() => String(props.text || ''));
const animate = computed(() => !props.disabled && !prefersReducedMotion.value && Boolean(fullText.value));
const showCursor = computed(() => Boolean(fullText.value) && !prefersReducedMotion.value);

function clearTimer() {
  if (timer) window.clearTimeout(timer);
  timer = 0;
}

function randInt(min, max) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function nextDelay(ch) {
  if (ch === '\n') return props.newlineDelayMs;
  if (ch === '.' || ch === ',' || ch === ';' || ch === ':' || ch === ')') return randInt(70, 140);
  if (ch === ' ') return randInt(10, 30);
  return randInt(props.minCharDelayMs, props.maxCharDelayMs);
}

function schedule(fn, ms) {
  clearTimer();
  timer = window.setTimeout(fn, Math.max(0, ms));
}

function syncReducedMotion() {
  if (typeof window === 'undefined') return;
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = Boolean(mq && mq.matches);
}

function runOnce() {
  clearTimer();
  running.value = true;
  visibleText.value = '';

  const target = fullText.value;
  if (!animate.value) {
    visibleText.value = target;
    running.value = false;
    return;
  }

  let i = 0;
  const step = () => {
    if (!animate.value) {
      visibleText.value = target;
      running.value = false;
      return;
    }

    i += 1;
    visibleText.value = target.slice(0, i);

    if (i >= target.length) {
      running.value = false;
      if (props.loop) {
        schedule(() => runOnce(), props.pauseAfterFinishMs);
      }
      return;
    }

    const nextChar = target.charAt(i);
    schedule(step, nextDelay(nextChar));
  };

  schedule(step, props.startDelayMs);
}

syncReducedMotion();

onMounted(() => {
  runOnce();
});

onBeforeUnmount(() => clearTimer());

watch(
  () => [props.text, props.disabled, props.loop, props.startDelayMs, props.minCharDelayMs, props.maxCharDelayMs, props.newlineDelayMs, props.pauseAfterFinishMs, props.reserveSpace, animate.value],
  () => runOnce(),
  { deep: false }
);
</script>

<style scoped>
.ctw-cursor {
  display: inline-block;
  width: 1ch;
  margin-left: 1px;
  animation: ctw-blink 1s steps(2, start) infinite;
}

@keyframes ctw-blink {
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ctw-cursor {
    animation: none !important;
    opacity: 0 !important;
  }
}
</style>

