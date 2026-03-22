<template>
  <Transition name="overlay-fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 backdrop-blur-md"
      aria-busy="true"
      :aria-label="`Loading state: ${state}`"
    >
      <div class="loader-coordinator flex flex-col items-center gap-12 w-full max-w-3xl px-6">

        <CinematicPortfolioLoader
          v-if="loaderType === 'cinematic'"
          :state="state"
          :progress="progress"
        />

        <MinimalistPortfolioLoader
          v-else-if="loaderType === 'minimalist'"
          :state="state"
          :progress="progress"
        />

        <!-- Main Advanced Loader (Morphing Shape) -->
        <AdvancedLoader
          v-else-if="loaderType === 'advanced'"
          :state="state"
          size="lg"
          :show-label="true"
          :colors="loaderColors"
        />

        <!-- Progress Indicator (Linear or Circular) -->
        <div v-else-if="loaderType === 'progress'" class="w-full flex flex-col items-center gap-6">
          <ProgressIndicator
            :mode="progressMode"
            :progress="currentProgress"
            :indeterminate="state === 'loading'"
            size="lg"
            :color="loaderColors.loading"
            :show-label="true"
          />
          <span class="text-sm font-medium text-white/80 animate-pulse">
            {{ loadingText }}
          </span>
        </div>

        <!-- Skeleton Fallback (for content loading) -->
        <div v-else-if="loaderType === 'skeleton'" class="w-full space-y-4">
          <SkeletonLoader type="rect" width="60%" height="2rem" />
          <SkeletonLoader type="text" width="90%" />
          <SkeletonLoader type="text" width="85%" />
          <SkeletonLoader type="card" />
        </div>

        <!-- Typing Name Loader -->
        <TypingNameLoader
          v-else-if="loaderType === 'typing-name'"
          text="Welcome To My Portfolio"
          :speed="60"
        />

        <!-- Success/Error Feedback Message -->
        <Transition name="message-fade">
          <div v-if="state !== 'loading'" class="status-message flex flex-col items-center gap-3">
            <span 
              v-if="loaderType !== 'typing-name' || state === 'error'"
              class="text-xl font-bold tracking-tight"
              :class="state === 'success' ? 'text-emerald-400' : 'text-rose-400'"
            >
              {{ state === 'success' ? 'Experience Ready' : 'Connection Error' }}
            </span>
            <p class="text-sm text-white/60 text-center max-w-xs">
              {{ state === 'success' ? 'Glad you\'re here. Enjoy exploring my work.' : 'Please check your internet connection or try refreshing the page.' }}
            </p>
          </div>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useLoading } from '@/composables/useLoading';
import CinematicPortfolioLoader from './CinematicPortfolioLoader.vue';
import MinimalistPortfolioLoader from './MinimalistPortfolioLoader.vue';
import AdvancedLoader from './AdvancedLoader.vue';
import ProgressIndicator from './ProgressIndicator.vue';
import SkeletonLoader from './SkeletonLoader.vue';
import TypingNameLoader from './TypingNameLoader.vue';

const { isLoading, state, progress } = useLoading();

// Loader configuration
const loaderType = ref('minimalist'); // 'minimalist', 'cinematic', 'advanced', 'progress', 'skeleton', 'typing-name'
const progressMode = ref('circular'); // 'linear', 'circular'
const currentProgress = ref(0);

const loaderColors = {
  loading: '#6366f1', // Indigo 500
  success: '#10b981', // Emerald 500
  error: '#f43f5e',   // Rose 500
  accent: '#818cf8',  // Indigo 400
  text: '#ffffff'
};

const loadingText = computed(() => {
  switch (state.value) {
    case 'loading': return 'Retrieving portfolio data';
    case 'success': return 'Finalizing content';
    case 'error': return 'Encountered an issue';
    default: return 'Please wait';
  }
});

// Simulate progress when in progress mode
let progressInterval = null;
watch(state, (newState) => {
  if (newState === 'loading' && loaderType.value === 'progress') {
    currentProgress.value = 0;
    progressInterval = setInterval(() => {
      if (currentProgress.value < 90) {
        currentProgress.value += Math.random() * 5;
      }
    }, 200);
  } else if (newState === 'success') {
    currentProgress.value = 100;
    if (progressInterval) clearInterval(progressInterval);
  } else {
    if (progressInterval) clearInterval(progressInterval);
  }
});
</script>

<style scoped>
.overlay-fade-enter-active,
.overlay-fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.overlay-fade-enter-from,
.overlay-fade-leave-to {
  opacity: 0;
  backdrop-filter: blur(0px);
}

.message-fade-enter-active {
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.status-message {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@media (prefers-reduced-motion: reduce) {
  .overlay-fade-enter-active,
  .overlay-fade-leave-active,
  .message-fade-enter-active {
    transition-duration: 0.1s;
  }
}
</style>
