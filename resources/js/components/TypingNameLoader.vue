<template>
  <div
    class="typing-loader-container"
    :class="{ 'is-replaying': replaying }"
    :style="{ '--typing-speed': `${speed}ms` }"
    role="status"
    :aria-label="text"
  >
    <div class="typing-text-wrapper">
      <span
        v-for="(char, index) in characters"
        :key="`${index}-${replayKey}`"
        class="typing-char"
        :style="{ animationDelay: `${index * speed}ms` }"
      >
        {{ char === ' ' ? '\u00A0' : char }}
      </span>
      <span class="typing-cursor" :style="{ animationDelay: `${characters.length * speed}ms` }"></span>
    </div>
    
    <!-- Accessibility Fallback -->
    <span class="sr-only">{{ text }}</span>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  text: {
    type: String,
    default: 'Welcome To My Portfolio'
  },
  speed: {
    type: Number,
    default: 60, // 40-80ms range as requested
    validator: (v) => v >= 40 && v <= 80
  },
  replay: {
    type: Boolean,
    default: false
  }
});

const characters = computed(() => props.text.split(''));
const replayKey = ref(0);
const replaying = ref(false);

// Function to trigger replay
const triggerReplay = () => {
  replaying.value = true;
  replayKey.value++;
  setTimeout(() => {
    replaying.value = false;
  }, characters.value.length * props.speed + 500);
};

// Watch for replay prop changes
watch(() => props.replay, (newVal) => {
  if (newVal) {
    triggerReplay();
  }
});

defineExpose({ replay: triggerReplay });
</script>

<style scoped>
.typing-loader-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
  font-size: 1.5rem;
  font-weight: 700;
  color: #4f46e5; /* Indigo 600 */
}

.dark .typing-loader-container {
  color: #818cf8; /* Indigo 400 */
}

@media (min-width: 640px) {
  .typing-loader-container {
    font-size: 2.25rem;
  }
}

.typing-text-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: relative;
}

.typing-char {
  opacity: 0;
  display: inline-block;
  animation: char-reveal 200ms forwards ease-out;
  will-change: opacity, transform;
}

.typing-cursor {
  display: inline-block;
  width: 3px;
  height: 1.2em;
  background-color: currentColor;
  margin-left: 2px;
  vertical-align: middle;
  animation: cursor-blink 0.8s infinite step-end;
}

@keyframes char-reveal {
  0% {
    opacity: 0;
    transform: translateY(4px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes cursor-blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@media (prefers-reduced-motion: reduce) {
  .typing-char {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
  .typing-cursor {
    animation-duration: 2s !important;
  }
}
</style>
