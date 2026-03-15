<template>
  <pre class="font-mono text-sm leading-relaxed">
    <template v-if="!animate">
      <template v-for="(line, idx) in lines" :key="idx">
        <span v-html="line"></span><br v-if="idx < lines.length - 1" />
      </template>
    </template>

    <template v-else>
      <template v-for="(line, idx) in lines" :key="idx">
        <span
          class="acb-line inline-block opacity-0"
          :style="{ animationDelay: `${idx * lineDelayMs}ms` }"
          v-html="line"
        ></span><br v-if="idx < lines.length - 1" />
      </template>
      <span class="acb-cursor inline-block w-[1ch]">|</span>
    </template>
  </pre>
</template>

<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
  lines: { type: Array, default: () => [] },
  lineDelayMs: { type: Number, default: 60 },
  disabled: { type: Boolean, default: false },
});

const prefersReducedMotion = ref(false);
if (typeof window !== 'undefined') {
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = Boolean(mq && mq.matches);
}

const animate = computed(() => !props.disabled && !prefersReducedMotion.value && props.lines.length > 0);
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

