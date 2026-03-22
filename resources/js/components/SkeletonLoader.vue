<template>
  <div
    class="skeleton-loader"
    :class="[
      `skeleton-${type}`,
      { 'skeleton-pulse': animation === 'pulse' },
      { 'skeleton-shimmer': animation === 'shimmer' }
    ]"
    :style="skeletonStyle"
    role="status"
    aria-hidden="true"
  >
    <div v-if="animation === 'shimmer'" class="shimmer-effect"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'text', // 'text', 'rect', 'circle', 'card'
    validator: (v) => ['text', 'rect', 'circle', 'card'].includes(v)
  },
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '1rem'
  },
  borderRadius: {
    type: String,
    default: '0.5rem'
  },
  animation: {
    type: String,
    default: 'shimmer', // 'none', 'pulse', 'shimmer'
    validator: (v) => ['none', 'pulse', 'shimmer'].includes(v)
  }
});

const skeletonStyle = computed(() => {
  const w = typeof props.width === 'number' ? `${props.width}px` : props.width;
  const h = typeof props.height === 'number' ? `${props.height}px` : props.height;
  
  const styles = {
    width: w,
    height: h,
    borderRadius: props.type === 'circle' ? '50%' : props.borderRadius
  };

  if (props.type === 'card') {
    styles.height = '12rem';
  }

  return styles;
});
</script>

<style scoped>
.skeleton-loader {
  background-color: #e2e8f0; /* Slate 200 */
  position: relative;
  overflow: hidden;
  display: block;
}

.dark .skeleton-loader {
  background-color: #1e293b; /* Slate 800 */
}

/* Pulse Animation */
.skeleton-pulse {
  animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Shimmer Animation */
.skeleton-shimmer .shimmer-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.2) 50%,
    transparent 100%
  );
  animation: shimmer 2s infinite linear;
  transform: translateX(-100%);
}

.dark .skeleton-shimmer .shimmer-effect {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 100%
  );
}

@keyframes shimmer {
  to { transform: translateX(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-pulse, .skeleton-shimmer .shimmer-effect {
    animation: none !important;
  }
}
</style>
