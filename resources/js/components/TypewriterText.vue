<template>
  <span class="relative inline-flex items-center">
    <span v-if="animate" class="sr-only">{{ text }}</span>

    <span
      v-if="!animate"
      class="inline-flex"
    >
      <template v-if="hasTwoLines">
        <span>{{ line1Full }}</span>
        <br />
        <span :class="secondaryClass">{{ line2Full }}</span>
      </template>
      <template v-else>
        {{ text }}
      </template>
    </span>

    <span
      v-else
      aria-hidden="true"
      class="inline-flex transition-opacity"
      :class="fading ? 'opacity-0' : 'opacity-100'"
      :style="{ transitionDuration: `${fadeDurationMs}ms` }"
    >
      <template v-if="hasTwoLines">
        <span>{{ line1Typed }}</span>
        <br />
        <span :class="secondaryClass">{{ line2Typed }}</span>
      </template>
      <template v-else>
        {{ typed }}
      </template>
    </span>

    <span
      v-if="animate"
      aria-hidden="true"
      class="ml-0.5 inline-block w-[1ch] text-current transition-opacity"
      :class="[fading ? 'opacity-0' : 'opacity-100', cursorClass]"
      :style="{ transitionDuration: `${fadeDurationMs}ms` }"
    >
      |
    </span>
  </span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  typingSpeedMs: { type: Number, default: 55 },
  pauseBeforeFadeMs: { type: Number, default: 1100 },
  fadeDurationMs: { type: Number, default: 420 },
  loop: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  secondaryClass: { type: String, default: '' },
});

const prefersReducedMotion = ref(false);
const typed = ref('');
const fading = ref(false);

let timers = [];

const animate = computed(() => {
  return !props.disabled && !prefersReducedMotion.value && Boolean(props.text);
});

const hasTwoLines = computed(() => String(props.text || '').includes('\n'));

const line1Full = computed(() => {
  const full = String(props.text || '');
  return full.split('\n')[0] || '';
});

const line2Full = computed(() => {
  const full = String(props.text || '');
  const parts = full.split('\n');
  return parts.length > 1 ? parts.slice(1).join('\n') : '';
});

const line1Typed = computed(() => {
  const t = String(typed.value || '');
  return t.split('\n')[0] || '';
});

const line2Typed = computed(() => {
  const t = String(typed.value || '');
  const parts = t.split('\n');
  return parts.length > 1 ? parts.slice(1).join('\n') : '';
});

const cursorClass = computed(() => {
  return animate.value ? 'tw-cursor' : '';
});

function clearTimers() {
  timers.forEach((t) => window.clearTimeout(t));
  timers = [];
}

function schedule(fn, ms) {
  const id = window.setTimeout(fn, ms);
  timers.push(id);
  return id;
}

function runOnce() {
  clearTimers();
  typed.value = '';
  fading.value = false;

  const full = String(props.text || '');
  if (!full) return;

  let i = 0;
  const step = () => {
    if (!animate.value) return;
    i += 1;
    typed.value = full.slice(0, i);
    if (i < full.length) {
      schedule(step, Math.max(10, props.typingSpeedMs));
      return;
    }

    schedule(() => {
      if (!animate.value) return;
      fading.value = true;
      schedule(() => {
        if (!animate.value) return;
        if (props.loop) runOnce();
      }, Math.max(0, props.fadeDurationMs));
    }, Math.max(0, props.pauseBeforeFadeMs));
  };

  schedule(step, Math.max(0, props.typingSpeedMs));
}

function syncReducedMotion() {
  if (typeof window === 'undefined') return;
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = Boolean(mq && mq.matches);
}

syncReducedMotion();

onMounted(() => {
  runOnce();
});

onBeforeUnmount(() => clearTimers());

watch(
  () => [props.text, props.typingSpeedMs, props.pauseBeforeFadeMs, props.fadeDurationMs, props.loop, props.disabled, animate.value],
  () => {
    if (!animate.value) {
      clearTimers();
      typed.value = props.text;
      fading.value = false;
      return;
    }
    runOnce();
  }
);
</script>

<style scoped>
.tw-cursor {
  animation: tw-blink 1s steps(2, start) infinite;
}

@keyframes tw-blink {
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
  .tw-cursor {
    animation: none !important;
  }
}
</style>
