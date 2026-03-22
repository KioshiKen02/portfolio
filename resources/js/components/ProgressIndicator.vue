<template>
  <div
    class="progress-indicator"
    :class="[`mode-${mode}`, `size-${size}`]"
    role="progressbar"
    :aria-valuenow="progress"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="ariaLabel"
  >
    <!-- Linear Mode -->
    <div v-if="mode === 'linear'" class="linear-track" :style="trackStyle">
      <div 
        class="linear-fill" 
        :style="fillStyle"
      >
        <div v-if="indeterminate" class="indeterminate-pulse"></div>
      </div>
    </div>

    <!-- Circular Mode -->
    <div v-else class="circular-wrapper">
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        class="circular-svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          class="circular-track"
          :style="trackStyle"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          stroke-width="8"
          stroke-linecap="round"
          class="circular-fill"
          :style="circularFillStyle"
        />
      </svg>
      <div v-if="showLabel" class="circular-label">
        {{ indeterminate ? '' : `${Math.round(progress)}%` }}
      </div>
    </div>

    <!-- Label -->
    <div v-if="mode === 'linear' && showLabel" class="linear-label">
      <span class="label-text">{{ indeterminate ? 'Loading...' : `${Math.round(progress)}%` }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  mode: {
    type: String,
    default: 'linear', // 'linear', 'circular'
    validator: (v) => ['linear', 'circular'].includes(v)
  },
  progress: {
    type: Number,
    default: 0,
    validator: (v) => v >= 0 && v <= 100
  },
  indeterminate: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  color: {
    type: String,
    default: '#4f46e5' // Indigo 600
  },
  showLabel: {
    type: Boolean,
    default: true
  },
  ariaLabel: {
    type: String,
    default: 'Progress'
  }
});

const trackStyle = computed(() => ({
  color: props.color,
  opacity: 0.2
}));

const fillStyle = computed(() => {
  if (props.indeterminate) {
    return {
      backgroundColor: props.color,
      width: '30%',
      animation: 'indeterminate-move 2s infinite linear'
    };
  }
  return {
    backgroundColor: props.color,
    width: `${props.progress}%`,
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };
});

const circularFillStyle = computed(() => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (props.progress / 100) * circumference;
  
  const styles = {
    color: props.color,
    strokeDasharray: circumference,
    strokeDashoffset: props.indeterminate ? circumference * 0.7 : offset,
    transition: 'stroke-dashoffset 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  if (props.indeterminate) {
    styles.animation = 'circular-rotate 2s infinite linear, circular-dash 1.5s infinite ease-in-out';
  }

  return styles;
});
</script>

<style scoped>
.progress-indicator {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

/* Linear Mode Styles */
.linear-track {
  height: 0.5rem;
  background-color: currentColor;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.linear-fill {
  height: 100%;
  border-radius: 9999px;
  position: relative;
}

.size-sm .linear-track { height: 0.25rem; }
.size-lg .linear-track { height: 0.75rem; }

/* Circular Mode Styles */
.mode-circular {
  width: auto;
  align-items: center;
}

.circular-wrapper {
  position: relative;
  display: inline-flex;
}

.circular-svg {
  transform: rotate(-90deg);
}

.size-sm .circular-svg { width: 32px; height: 32px; }
.size-md .circular-svg { width: 64px; height: 64px; }
.size-lg .circular-svg { width: 96px; height: 96px; }

.circular-label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.75rem;
  font-weight: 700;
  color: #475569; /* Slate 600 */
}

.dark .circular-label { color: #94a3b8; /* Slate 400 */ }

/* Linear Label Styles */
.linear-label {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  font-weight: 600;
  color: #475569;
}

.dark .linear-label { color: #94a3b8; }

/* Keyframes */
@keyframes indeterminate-move {
  0% { transform: translateX(-150%); }
  100% { transform: translateX(350%); }
}

@keyframes circular-rotate {
  to { transform: rotate(360deg); }
}

@keyframes circular-dash {
  0% { stroke-dashoffset: 282.7; }
  50% { stroke-dashoffset: 70.6; }
  100% { stroke-dashoffset: 282.7; }
}

@media (prefers-reduced-motion: reduce) {
  .linear-fill, .circular-fill {
    animation: none !important;
  }
}
</style>
