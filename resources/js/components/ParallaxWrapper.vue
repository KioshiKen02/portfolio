<template>
  <div 
    ref="parallaxEl" 
    class="parallax-element"
    :style="parallaxStyle"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
  speed: {
    type: Number,
    default: 1.0 // 1.0 is normal, 0.5 is slow (background), 1.2 is fast (foreground)
  },
  maxTranslate: {
    type: Number,
    default: 100
  }
});

const scrollY = ref(0);
const parallaxEl = ref(null);
const initialTop = ref(0);

const handleScroll = () => {
  scrollY.value = window.scrollY;
};

const parallaxStyle = computed(() => {
  if (typeof window === 'undefined') return {};
  
  // prefers-reduced-motion support
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return {};

  const rect = parallaxEl.value?.getBoundingClientRect();
  if (!rect) return {};

  // Calculate relative movement
  const speedFactor = props.speed - 1; // background: 0.5 -> -0.5, foreground: 1.2 -> 0.2
  const translateY = scrollY.value * speedFactor;
  
  // Clamp movement
  const clampedY = Math.max(-props.maxTranslate, Math.min(props.maxTranslate, translateY));

  return {
    transform: `translate3d(0, ${clampedY}px, 0)`,
    willChange: 'transform'
  };
});

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true });
  if (parallaxEl.value) {
    initialTop.value = parallaxEl.value.offsetTop;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.parallax-element {
  transition: transform 0.1s linear;
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
