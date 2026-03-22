<template>
  <div
    class="particle-loader"
    :class="[`particle-count-${particleCount}`]"
    role="status"
    aria-hidden="true"
  >
    <div
      v-for="i in particleCount"
      :key="i"
      class="particle"
      :style="particleStyle(i)"
    ></div>
    
    <div v-if="showLabel" class="particle-label">
      <slot>{{ label }}</slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  particleCount: {
    type: Number,
    default: 12,
    validator: (v) => v > 0 && v <= 50
  },
  color: {
    type: String,
    default: '#4f46e5' // Indigo 600
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  label: {
    type: String,
    default: 'Loading Experience'
  },
  showLabel: {
    type: Boolean,
    default: true
  }
});

const particleStyle = (index) => {
  const angle = (index / props.particleCount) * 360;
  const delay = (index / props.particleCount) * -1.2;
  const size = props.size === 'sm' ? 4 : props.size === 'lg' ? 12 : 8;
  const radius = props.size === 'sm' ? 24 : props.size === 'lg' ? 64 : 48;
  
  return {
    backgroundColor: props.color,
    width: `${size}px`,
    height: `${size}px`,
    left: '50%',
    top: '50%',
    marginLeft: `${-size / 2}px`,
    marginTop: `${-size / 2}px`,
    transformOrigin: `0 ${radius}px`,
    transform: `rotate(${angle}deg)`,
    animationDelay: `${delay}s`,
    animationDuration: '1.2s'
  };
};
</script>

<style scoped>
.particle-loader {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 12rem;
  width: 100%;
}

.particle {
  position: absolute;
  border-radius: 50%;
  opacity: 0;
  animation: particle-fade 1.2s infinite ease-in-out;
  filter: blur(1px);
}

.particle-label {
  margin-top: 4rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  animation: text-pulse 2s infinite ease-in-out;
}

.dark .particle-label {
  color: #94a3b8;
}

@keyframes particle-fade {
  0%, 100% {
    opacity: 0;
    transform: rotate(var(--rotation)) scale(0.5);
  }
  50% {
    opacity: 0.8;
    transform: rotate(var(--rotation)) scale(1.2);
  }
}

@keyframes text-pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .particle, .particle-label {
    animation: none !important;
    opacity: 1 !important;
  }
}
</style>
