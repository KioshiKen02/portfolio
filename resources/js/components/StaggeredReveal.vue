<template>
  <div
    ref="container"
    class="staggered-reveal"
    :class="[animationType, { 'is-visible': isVisible }]"
    role="region"
    aria-label="Content reveal"
  >
    <slot />
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  delay: {
    type: Number,
    default: 100 // Delay in ms between items
  },
  duration: {
    type: Number,
    default: 600 // Duration in ms for each item's animation
  },
  animationType: {
    type: String,
    default: 'fade-slide', // 'fade', 'fade-slide', 'scale', 'flip'
    validator: (v) => ['fade', 'fade-slide', 'scale', 'flip'].includes(v)
  },
  staggerChildren: {
    type: Boolean,
    default: true
  }
});

const container = ref(null);
const isVisible = ref(false);

onMounted(() => {
  if (props.staggerChildren && container.value) {
    const children = Array.from(container.value.children);
    children.forEach((child, index) => {
      child.style.opacity = '0';
      child.style.transitionProperty = 'opacity, transform';
      child.style.transitionDuration = `${props.duration}ms`;
      child.style.transitionDelay = `${props.delay * index}ms`;
      child.style.transitionTimingFunction = 'cubic-bezier(0.22, 1, 0.36, 1)';
      child.style.willChange = 'transform, opacity';
    });

    // Use IntersectionObserver to trigger reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible.value = true;
            children.forEach((child) => {
              child.style.opacity = '1';
              child.style.transform = 'translate(0, 0) scale(1) rotateX(0)';
              
              // Cleanup will-change after animation
              setTimeout(() => {
                child.style.willChange = 'auto';
              }, props.duration + (props.delay * children.length));
            });
            observer.unobserve(container.value);
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container.value);
  }
});
</script>

<style scoped>
.staggered-reveal {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

/* Base Styles for Children (Pre-reveal) */
.staggered-reveal :slotted(*) {
  opacity: 0;
}

/* Animation Types */
.fade-slide :slotted(*) {
  transform: translateY(24px);
}

.scale :slotted(*) {
  transform: scale(0.92);
}

.flip :slotted(*) {
  transform: rotateX(-30deg);
  perspective: 1000px;
}

@media (prefers-reduced-motion: reduce) {
  .staggered-reveal :slotted(*) {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
