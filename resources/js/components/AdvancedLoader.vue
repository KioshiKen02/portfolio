<template>
  <div
    class="advanced-loader-container"
    :class="[`state-${state}`, `size-${size}`]"
    role="status"
    :aria-live="state === 'loading' ? 'polite' : 'assertive'"
    :aria-label="ariaLabel"
  >
    <div class="loader-visual-wrapper">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        class="morphing-svg"
        :style="svgStyle"
      >
        <path
          ref="morphPath"
          class="morph-path"
          :d="currentPath"
          :fill="currentColor"
          :style="pathStyle"
        />
        
        <!-- Animated Elements -->
        <circle
          v-if="state === 'loading'"
          class="orbiting-dot"
          cx="50"
          cy="20"
          r="4"
          :fill="accentColor"
        />
        
        <!-- Success/Error Icons -->
        <g v-if="state === 'success'" class="icon-group success-icon">
          <path d="M35 50 L45 60 L65 40" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <g v-if="state === 'error'" class="icon-group error-icon">
          <path d="M35 35 L65 65 M65 35 L35 65" stroke="white" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round" />
        </g>
      </svg>
    </div>
    
    <div v-if="showLabel" class="loader-label" :style="{ color: textColor }">
      <span class="label-text">{{ labelText }}</span>
      <span v-if="state === 'loading'" class="loading-dots">
        <span>.</span><span>.</span><span>.</span>
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  state: {
    type: String,
    default: 'loading',
    validator: (v) => ['idle', 'loading', 'success', 'error'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  colors: {
    type: Object,
    default: () => ({
      loading: '#4f46e5', // Indigo 600
      success: '#10b981', // Emerald 500
      error: '#ef4444',   // Rose 500
      accent: '#818cf8',  // Indigo 400
      text: '#ffffff'
    })
  },
  speed: {
    type: Number,
    default: 1.0 // multiplier
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  customLabels: {
    type: Object,
    default: () => ({})
  }
});

// SVG Paths for morphing
const paths = {
  loading: "M50,15 Q85,15 85,50 Q85,85 50,85 Q15,85 15,50 Q15,15 50,15 Z",
  success: "M50,10 Q90,10 90,50 Q90,90 50,90 Q10,90 10,50 Q10,10 50,10 Z",
  error: "M50,20 Q80,20 80,50 Q80,80 50,80 Q20,80 20,50 Q20,20 50,20 Z"
};

const currentPath = computed(() => paths[props.state] || paths.loading);

const currentColor = computed(() => props.colors[props.state] || props.colors.loading);
const accentColor = computed(() => props.colors.accent);
const textColor = computed(() => props.colors.text);

const labelText = computed(() => {
  if (props.customLabels[props.state]) return props.customLabels[props.state];
  switch (props.state) {
    case 'loading': return 'Processing';
    case 'success': return 'Complete';
    case 'error': return 'Failed';
    default: return '';
  }
});

const ariaLabel = computed(() => {
  return `${labelText.value}${props.state === 'loading' ? '... please wait' : ''}`;
});

const svgStyle = computed(() => ({
  animationDuration: `${3 / props.speed}s`
}));

const pathStyle = computed(() => ({
  transition: `all ${0.5 / props.speed}s cubic-bezier(0.4, 0, 0.2, 1)`
}));
</script>

<style scoped>
.advanced-loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

/* Sizes */
.size-sm .morphing-svg { width: 48px; height: 48px; }
.size-md .morphing-svg { width: 80px; height: 80px; }
.size-lg .morphing-svg { width: 120px; height: 120px; }

.morphing-svg {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
}

.state-loading .morphing-svg {
  animation: morph-rotate 8s infinite linear;
}

.morph-path {
  transform-origin: center;
}

.state-loading .morph-path {
  animation: pulse-morph 3s infinite ease-in-out;
}

.orbiting-dot {
  transform-origin: center;
  animation: orbit 2s infinite linear;
}

.icon-group {
  opacity: 0;
  transform: scale(0.5);
  animation: icon-pop-in 0.4s forwards cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.loader-label {
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: 0.025em;
  display: flex;
  align-items: center;
  gap: 2px;
}

.loading-dots span {
  animation: dot-flash 1.4s infinite;
  opacity: 0;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }

/* Keyframes */
@keyframes morph-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse-morph {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(0.95); }
}

@keyframes orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes icon-pop-in {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes dot-flash {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .state-loading .morphing-svg,
  .state-loading .morph-path,
  .orbiting-dot,
  .loading-dots span {
    animation: none !important;
  }
  .icon-group {
    animation-duration: 0.1s !important;
  }
}
</style>
