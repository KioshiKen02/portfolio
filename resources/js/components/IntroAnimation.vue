<template>
  <div 
    v-if="isVisible" 
    ref="container"
    :class="[
      'intro-container',
      animationClass,
      { 'is-animating': isAnimating }
    ]"
    :style="{ 
      animationDelay: `${delay}ms`,
      zIndex: zIndex 
    }"
    @animationend="handleAnimationEnd"
  >
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'zoom', // 'zoom', 'fade', 'slide-up'
    validator: (value) => ['zoom', 'fade', 'slide-up'].includes(value)
  },
  delay: {
    type: Number,
    default: 0
  },
  zIndex: {
    type: Number,
    default: 1
  }
});

const isVisible = ref(false);
const isAnimating = ref(false);
const container = ref(null);

const animationClass = computed(() => {
  switch (props.type) {
    case 'zoom': return 'animate-intro-zoom';
    case 'fade': return 'animate-intro-fade';
    case 'slide-up': return 'animate-intro-slide-up';
    default: return 'animate-intro-zoom';
  }
});

const handleAnimationEnd = (event) => {
  if (event.target === container.value) {
    isAnimating.value = false;
    // Cleanup will-change for performance after animation ends
    if (container.value) {
      container.value.style.willChange = 'auto';
    }
  }
};

onMounted(() => {
  isVisible.value = true;
  isAnimating.value = true;
});
</script>

<style scoped>
.intro-container {
  opacity: 0; /* Start hidden */
}

.is-animating {
  /* Ensure it stays visible during animation */
  opacity: 1;
}

/* Ensure children can have their own depth for parallax if needed */
.intro-container > * {
  transform-style: preserve-3d;
}
</style>
