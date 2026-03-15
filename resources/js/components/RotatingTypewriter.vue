  <template>
  <span class="relative z-10 inline-block max-w-full align-baseline">
    <span
      v-if="reserveSpace"
      aria-hidden="true"
      class="rtw-reserve inline-block max-w-full opacity-0 whitespace-normal break-words"
    >{{ reserveText }}</span>

    <span class="rtw-live" :class="reserveSpace ? 'absolute inset-0' : ''">
      <span class="whitespace-normal break-words">{{ visible }}</span>
      <span v-if="showCursor" aria-hidden="true" class="rtw-cursor">|</span>
    </span>
  </span>
</template>

<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue';

const props = defineProps({
  phrases: { type: Array, default: () => [] },
  typingMs: { type: Number, default: 120 },
  deletingMs: { type: Number, default: 120 },
  pauseMs: { type: Number, default: 650 },
  startDelayMs: { type: Number, default: 120 },
  loop: { type: Boolean, default: true },
  reserveSpace: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
});

const prefersReducedMotion = ref(false);
const visible = ref('');
const phraseIdx = ref(0);
const charIdx = ref(0);
const mode = ref('typing'); // typing | pausing | deleting

let timer = 0;

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
    return;
  }

  if (!animate.value) {
    visible.value = activePhrase.value;
    return;
  }

  const phrase = activePhrase.value;

  if (mode.value === 'typing') {
    charIdx.value = Math.min(phrase.length, charIdx.value + 1);
    visible.value = phrase.slice(0, charIdx.value);

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

watch(
  () => [
    normalizedPhrases.value.join('\u0000'),
    props.typingMs,
    props.deletingMs,
    props.pauseMs,
    props.startDelayMs,
    props.loop,
    props.reserveSpace,
    props.disabled,
    animate.value,
  ],
  () => start(),
  { deep: false, immediate: true }
);
</script>

<style scoped>
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
