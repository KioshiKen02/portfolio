  <template>
  <span ref="root" class="rtw-root relative z-10 block max-w-full align-baseline" :style="rootStyle">
    <span ref="measure" aria-hidden="true" class="rtw-measure whitespace-normal break-words">{{ visible || '\u00A0' }}</span>

    <span class="rtw-live absolute inset-0">
      <span class="whitespace-normal break-words">{{ visible }}</span>
      <span v-if="showCursor" aria-hidden="true" class="rtw-cursor">|</span>
    </span>
  </span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  phrases: { type: Array, default: () => [] },
  typingMs: { type: Number, default: 120 },
  deletingMs: { type: Number, default: 120 },
  pauseMs: { type: Number, default: 650 },
  startDelayMs: { type: Number, default: 120 },
  loop: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  minHeightEm: { type: Number, default: 0 },
  resizeDurationMs: { type: Number, default: 220 },
  measureHeightFn: { type: Function, default: null },
});

const root = ref(null);
const measure = ref(null);

const prefersReducedMotion = ref(false);
const visible = ref('');
const phraseIdx = ref(0);
const charIdx = ref(0);
const mode = ref('typing'); // typing | pausing | deleting

let timer = 0;
let ro = null;
let raf = 0;

function clearTimer() {
  if (timer) window.clearTimeout(timer);
  timer = 0;
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

const normalizedPhrases = computed(() => {
  const list = Array.isArray(props.phrases) ? props.phrases : [];
  return list.map((p) => String(p ?? '')).filter(Boolean);
});

const activePhrase = computed(() => normalizedPhrases.value[phraseIdx.value] || '');

const reserveText = computed(() => {
  const list = normalizedPhrases.value;
  if (!list.length) return '';
  return list.reduce((a, b) => (a.length >= b.length ? a : b), '');
});

const animate = computed(() => {
  return !props.disabled && !prefersReducedMotion.value && normalizedPhrases.value.length > 0;
});

const showCursor = computed(() => normalizedPhrases.value.length > 0 && !prefersReducedMotion.value);

const measuredHeightPx = ref(0);

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function readBaseFontSize() {
  if (!root.value || typeof window === 'undefined') return 0;
  const cs = window.getComputedStyle(root.value);
  const fs = Number.parseFloat(cs.fontSize || '');
  return Number.isFinite(fs) && fs > 0 ? fs : 0;
}

function computeMinHeightPx() {
  const fs = readBaseFontSize();
  if (!fs) return 0;
  return Math.max(0, props.minHeightEm) * fs;
}

function computeHeightPx() {
  if (!root.value) return;
  const host = root.value.parentElement || root.value;
  const width = host.getBoundingClientRect ? host.getBoundingClientRect().width : 0;
  const text = String(visible.value || reserveText.value || '');

  if (props.measureHeightFn) {
    measuredHeightPx.value = Math.max(0, Number(props.measureHeightFn({ text, width })) || 0);
    return;
  }

  if (!measure.value) return;
  measuredHeightPx.value = Math.max(0, measure.value.scrollHeight || measure.value.offsetHeight || 0);
}

function requestHeightUpdate() {
  if (props.measureHeightFn || typeof window === 'undefined') {
    computeHeightPx();
    return;
  }
  if (raf) return;
  raf = window.requestAnimationFrame(() => {
    raf = 0;
    computeHeightPx();
  });
}

const rootStyle = computed(() => {
  const minPx = computeMinHeightPx();
  const target = Math.max(minPx, measuredHeightPx.value || 0);
  const duration = prefersReducedMotion.value ? 0 : Math.max(0, props.resizeDurationMs);
  return {
    height: target ? `${Math.ceil(target)}px` : undefined,
    minHeight: minPx ? `${Math.ceil(minPx)}px` : undefined,
    transitionProperty: 'height',
    transitionDuration: `${duration}ms`,
    transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: duration ? 'height' : undefined,
  };
});

function reset() {
  visible.value = '';
  phraseIdx.value = 0;
  charIdx.value = 0;
  mode.value = 'typing';
}

function start() {
  reset();
  if (!animate.value) {
    visible.value = activePhrase.value;
    requestHeightUpdate();
    return;
  }
  if (props.startDelayMs <= 0) {
    step();
    return;
  }
  schedule(step, props.startDelayMs);
}

function step() {
  if (!normalizedPhrases.value.length) {
    visible.value = '';
    requestHeightUpdate();
    return;
  }

  if (!animate.value) {
    visible.value = activePhrase.value;
    requestHeightUpdate();
    return;
  }

  const phrase = activePhrase.value;

  if (mode.value === 'typing') {
    charIdx.value = Math.min(phrase.length, charIdx.value + 1);
    visible.value = phrase.slice(0, charIdx.value);
    requestHeightUpdate();

    if (charIdx.value >= phrase.length) {
      mode.value = 'pausing';
      schedule(step, props.pauseMs);
      return;
    }

    schedule(step, props.typingMs);
    return;
  }

  if (mode.value === 'pausing') {
    mode.value = 'deleting';
    schedule(step, props.deletingMs);
    return;
  }

  if (mode.value === 'deleting') {
    charIdx.value = Math.max(0, charIdx.value - 1);
    visible.value = phrase.slice(0, charIdx.value);
    requestHeightUpdate();

    if (charIdx.value <= 0) {
      const next = (phraseIdx.value + 1) % normalizedPhrases.value.length;
      const isLast = phraseIdx.value === normalizedPhrases.value.length - 1;
      phraseIdx.value = next;
      mode.value = 'typing';

      if (!props.loop && isLast) {
        visible.value = normalizedPhrases.value[normalizedPhrases.value.length - 1] || '';
        clearTimer();
        return;
      }

      schedule(step, props.startDelayMs);
      return;
    }

    schedule(step, props.deletingMs);
  }
}

syncReducedMotion();

onBeforeUnmount(() => clearTimer());

onMounted(() => {
  requestHeightUpdate();

  if (typeof window === 'undefined') return;

  if ('ResizeObserver' in window) {
    ro = new ResizeObserver(() => requestHeightUpdate());
    ro.observe((root.value && root.value.parentElement) || root.value);
  } else {
    window.addEventListener('resize', requestHeightUpdate, { passive: true });
  }
});

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  ro = null;
  if (typeof window !== 'undefined') window.removeEventListener('resize', requestHeightUpdate, { passive: true });
  if (raf && typeof window !== 'undefined') window.cancelAnimationFrame(raf);
  raf = 0;
});

watch(
  () => [
    normalizedPhrases.value.join('\u0000'),
    props.typingMs,
    props.deletingMs,
    props.pauseMs,
    props.startDelayMs,
    props.loop,
    props.disabled,
    props.minHeightEm,
    props.resizeDurationMs,
    props.measureHeightFn,
    animate.value,
  ],
  () => {
    requestHeightUpdate();
    start();
  },
  { deep: false, immediate: true }
);
</script>

<style scoped>
.rtw-root {
  overflow: hidden;
}

.rtw-measure {
  visibility: hidden;
  pointer-events: none;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}

.rtw-cursor {
  display: inline-block;
  width: 1ch;
  margin-left: 1px;
  animation: rtw-blink 1s steps(2, start) infinite;
}

@keyframes rtw-blink {
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
  .rtw-cursor {
    animation: none !important;
    opacity: 0 !important;
  }
}
</style>
