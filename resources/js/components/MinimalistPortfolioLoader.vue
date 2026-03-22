<template>
  <div class="wrap w-full max-w-[34rem]">
    <div class="panel relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-slate-950/40 px-8 py-9 shadow-[0_30px_90px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl">
      <div class="glow" aria-hidden="true"></div>

      <div class="relative flex items-center justify-between gap-8">
        <div class="min-w-0">
          <p class="text-[10px] font-black uppercase tracking-[0.32em] text-white/55">
            Loading
          </p>
          <h2 class="mt-2 text-2xl font-black tracking-tight text-white">
            {{ title }}
          </h2>
          <p class="mt-1 text-sm font-semibold text-white/65">
            {{ subtitle }}
          </p>
        </div>

        <div class="shrink-0">
          <div class="orb" :class="orbTone" aria-hidden="true">
            <div class="orb-core"></div>
            <div class="orb-dot"></div>
          </div>
        </div>
      </div>

      <div class="relative mt-7">
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-black uppercase tracking-[0.28em]" :class="toneText">
            {{ stateLabel }}
          </span>
          <span class="text-[10px] font-black text-white/55 tabular-nums">
            {{ displayProgress }}%
          </span>
        </div>

        <div class="mt-3 h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div class="bar" :class="toneBar" :style="{ transform: `scaleX(${Math.max(0, Math.min(1, displayProgress / 100))})` }"></div>
          <div v-if="state === 'loading'" class="sheen" aria-hidden="true"></div>
        </div>

        <div class="mt-5 text-xs font-semibold text-white/60">
          {{ detail }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
  state: { type: String, default: 'loading' },
  title: { type: String, default: 'Welcome To My Portfolio' },
  subtitle: { type: String, default: 'Preparing content…' },
  progress: { type: Number, default: null },
});

const displayProgress = ref(0);

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

watch(
  () => props.progress,
  (p) => {
    if (typeof p === 'number' && Number.isFinite(p)) {
      displayProgress.value = clamp(Math.round(p), 0, 100);
    }
  },
  { immediate: true }
);

watch(
  () => props.state,
  (s) => {
    if (s === 'success') displayProgress.value = 100;
    if (s === 'error') displayProgress.value = Math.max(displayProgress.value, 80);
  },
  { immediate: true }
);

const stateLabel = computed(() => {
  if (props.state === 'success') return 'Ready';
  if (props.state === 'error') return 'Issue';
  return 'Loading';
});

const detail = computed(() => {
  if (props.state === 'success') return 'Transitioning into the experience.';
  if (props.state === 'error') return 'Some resources failed. You can refresh to retry.';
  if (displayProgress.value < 35) return 'Warming up interface layers.';
  if (displayProgress.value < 70) return 'Fetching projects and experience.';
  return 'Finalizing visuals and interactions.';
});

const toneText = computed(() => {
  if (props.state === 'success') return 'text-emerald-300';
  if (props.state === 'error') return 'text-rose-300';
  return 'text-white/70';
});

const toneBar = computed(() => {
  if (props.state === 'success') return 'bar-success';
  if (props.state === 'error') return 'bar-error';
  return 'bar-loading';
});

const orbTone = computed(() => {
  if (props.state === 'success') return 'orb-success';
  if (props.state === 'error') return 'orb-error';
  return 'orb-loading';
});

const state = computed(() => props.state);
</script>

<style scoped>
.wrap {
  transform: translateZ(0);
}

.panel {
  isolation: isolate;
}

.glow {
  position: absolute;
  inset: -60%;
  background:
    radial-gradient(circle at 30% 30%, rgba(99,102,241,0.18), rgba(99,102,241,0) 55%),
    radial-gradient(circle at 70% 70%, rgba(16,185,129,0.12), rgba(16,185,129,0) 55%),
    radial-gradient(circle at 70% 20%, rgba(244,63,94,0.10), rgba(244,63,94,0) 55%);
  filter: blur(48px);
  opacity: 0.9;
  z-index: -1;
}

.bar {
  height: 100%;
  width: 100%;
  transform-origin: left;
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.bar-loading {
  background: rgba(255,255,255,0.72);
}

.bar-success {
  background: rgba(16,185,129,0.95);
}

.bar-error {
  background: rgba(244,63,94,0.95);
}

.sheen {
  position: absolute;
  left: -40%;
  top: 0;
  height: 2px;
  width: 40%;
  background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.30), rgba(255,255,255,0));
  animation: sweep 1.35s ease-in-out infinite;
}

@keyframes sweep {
  0% { transform: translateX(0); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateX(350%); opacity: 0; }
}

.orb {
  position: relative;
  height: 3.25rem;
  width: 3.25rem;
  border-radius: 999px;
  border: 1px solid rgba(255,255,255,0.14);
  background: rgba(2,6,23,0.25);
  box-shadow: 0 20px 60px -40px rgba(0,0,0,0.8);
}

.orb-core {
  position: absolute;
  inset: 10px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.10), rgba(2,6,23,0.65));
  border: 1px solid rgba(255,255,255,0.10);
}

.orb-dot {
  position: absolute;
  left: 50%;
  top: 50%;
  height: 6px;
  width: 6px;
  border-radius: 999px;
  transform: translate(-50%, -50%) translateY(-22px);
  box-shadow: 0 0 0 0 rgba(255,255,255,0.25);
  animation: orbit 1.35s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
}

@keyframes orbit {
  0% { transform: translate(-50%, -50%) rotate(0deg) translateY(-22px) rotate(0deg); opacity: 0.9; }
  100% { transform: translate(-50%, -50%) rotate(360deg) translateY(-22px) rotate(-360deg); opacity: 0.9; }
}

.orb-loading .orb-dot {
  background: rgba(255,255,255,0.88);
}

.orb-success .orb-dot {
  background: rgba(16,185,129,0.95);
}

.orb-error .orb-dot {
  background: rgba(244,63,94,0.95);
}

@media (prefers-reduced-motion: reduce) {
  .sheen,
  .orb-dot {
    animation: none;
  }
}
</style>
