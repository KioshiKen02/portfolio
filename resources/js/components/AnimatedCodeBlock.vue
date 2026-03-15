<template>
  <pre class="m-0 font-mono text-sm leading-relaxed text-left whitespace-pre">
    <template v-if="!animate">
      <template v-for="(line, idx) in lines" :key="idx">
        <span v-html="line"></span><br v-if="idx < lines.length - 1" />
      </template>
    </template>

    <template v-else>
      <template v-for="(line, idx) in lines" :key="`${seed}-${idx}`">
        <span
          class="acb-line inline-block opacity-0"
          :style="{ animationDelay: `${startDelayMs + idx * lineDelayMs}ms` }"
          v-html="line"
        ></span><br v-if="idx < lines.length - 1" />
      </template>
      <span
        class="acb-cursor inline-block w-[1ch] transition-opacity"
        :class="fading ? 'opacity-0' : 'opacity-100'"
        :style="{ transitionDuration: `${fadeDurationMs}ms` }"
      >|</span>
    </template>
  </pre>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  lines: { type: Array, default: () => [] },
  lineDelayMs: { type: Number, default: 60 },
  startDelayMs: { type: Number, default: 0 },
  pauseBeforeRestartMs: { type: Number, default: 1400 },
  fadeDurationMs: { type: Number, default: 450 },
  loop: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

const prefersReducedMotion = ref(false);
if (typeof window !== 'undefined') {
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = Boolean(mq && mq.matches);
}

const animate = computed(() => !props.disabled && !prefersReducedMotion.value && props.lines.length > 0);

const seed = ref(0);
const fading = ref(false);
let timers = [];

function clearTimers() {
  timers.forEach((t) => window.clearTimeout(t));
  timers = [];
}

function schedule(fn, ms) {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function run() {
  if (!animate.value) return;
  clearTimers();
  fading.value = false;
  seed.value += 1;

  const totalMs = props.startDelayMs + Math.max(0, (props.lines.length - 1) * props.lineDelayMs) + 420;
  schedule(() => {
    if (!animate.value) return;
    fading.value = true;
    schedule(() => {
      if (!animate.value) return;
      if (props.loop) run();
    }, Math.max(0, props.fadeDurationMs));
  }, Math.max(0, totalMs + props.pauseBeforeRestartMs));
}

onMounted(() => run());
onBeforeUnmount(() => clearTimers());

watch(
  () => [props.lines, props.lineDelayMs, props.startDelayMs, props.pauseBeforeRestartMs, props.fadeDurationMs, props.loop, props.disabled, animate.value],
  () => {
    clearTimers();
    fading.value = false;
    if (animate.value) run();
  },
  { deep: false }
);
</script>

<style scoped>
.acb-line {
  animation: acb-in 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes acb-in {
  0% {
    opacity: 0;
    transform: translateY(6px);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}

.acb-cursor {
  margin-left: 2px;
  opacity: 1;
  animation: acb-blink 1s steps(2, start) infinite;
}

@keyframes acb-blink {
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
  .acb-line {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  .acb-cursor {
    animation: none !important;
    opacity: 0 !important;
  }
}
</style>
