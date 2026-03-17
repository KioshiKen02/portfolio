<template>
  <div
    class="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/60 shadow-sm backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/30"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
    role="img"
    :aria-label="alt"
  >
    <div class="relative aspect-square w-full">
      <img
        :src="resolvedDefaultSrc"
        alt=""
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover transition duration-500 will-change-transform"
        :class="hovered ? 'opacity-0 scale-[1.02]' : 'opacity-100 scale-100'"
        @error="defaultFailed = true"
      />
      <img
        :src="resolvedHoverSrc"
        alt=""
        loading="lazy"
        decoding="async"
        class="absolute inset-0 h-full w-full object-cover transition duration-500 will-change-transform"
        :class="hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-[1.02]'"
        @error="hoverFailed = true"
      />

      <div
        class="pointer-events-none absolute inset-0"
        :class="hovered ? 'opacity-100' : 'opacity-0'"
        style="transition: opacity 500ms cubic-bezier(0.22, 1, 0.36, 1)"
      >
        <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-emerald-500/10"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  alt: { type: String, default: 'Profile picture' },
  isDark: { type: Boolean, default: false },
  lightDefaultSrc: { type: String, default: '' },
  lightHoverSrc: { type: String, default: '' },
  darkDefaultSrc: { type: String, default: '' },
  darkHoverSrc: { type: String, default: '' },
  fallbackSrc: { type: String, default: '/logo.svg' },
});

const hovered = ref(false);
const defaultFailed = ref(false);
const hoverFailed = ref(false);

watch(
  () => props.isDark,
  () => {
    defaultFailed.value = false;
    hoverFailed.value = false;
  }
);

const defaultSrc = computed(() => (props.isDark ? props.darkDefaultSrc : props.lightDefaultSrc));
const hoverSrc = computed(() => (props.isDark ? props.darkHoverSrc : props.lightHoverSrc));

const resolvedDefaultSrc = computed(() => {
  if (defaultFailed.value) return props.fallbackSrc;
  return defaultSrc.value || props.fallbackSrc;
});

const resolvedHoverSrc = computed(() => {
  if (hoverFailed.value) return props.fallbackSrc;
  return hoverSrc.value || resolvedDefaultSrc.value;
});
</script>

<style scoped>
@media (prefers-reduced-motion: reduce) {
  img {
    transition: none !important;
  }
}
</style>
