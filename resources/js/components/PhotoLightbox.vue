<template>
  <Transition name="lightbox">
    <div
      v-if="open"
      class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm"
      @click.self="emit('close')"
    >
      <div class="absolute inset-0"></div>

      <div class="relative h-[92vh] w-[94vw] max-w-6xl">
        <button
          type="button"
          class="absolute right-3 top-3 z-10 rounded-xl bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Close"
          @click="emit('close')"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Previous"
          @click="prev"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          v-if="images.length > 1"
          type="button"
          class="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-xl bg-white/10 p-2 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Next"
          @click="next"
        >
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div class="absolute inset-x-0 bottom-3 z-10 flex justify-center">
          <div class="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {{ index + 1 }} of {{ images.length }}
          </div>
        </div>

        <div
          class="relative h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40"
          tabindex="0"
          ref="stage"
          @keydown="onKeydown"
          @dblclick.prevent="toggleZoom"
          @wheel.passive="onWheel"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div class="absolute inset-0 bg-slate-800/50" :class="imgLoaded ? 'opacity-0' : 'opacity-100 animate-pulse'" style="transition: opacity 260ms ease"></div>

          <img
            v-if="images[index]"
            :src="images[index]"
            :alt="altText"
            class="absolute left-1/2 top-1/2 max-h-none max-w-none select-none"
            :style="imgStyle"
            draggable="false"
            loading="eager"
            decoding="async"
            @load="imgLoaded = true"
            @error="imgLoaded = true"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  images: { type: Array, default: () => [] },
  index: { type: Number, default: 0 },
  title: { type: String, default: 'Project' },
});

const emit = defineEmits(['close', 'update:index']);

const stage = ref(null);
const imgLoaded = ref(false);
const scale = ref(1);
const tx = ref(0);
const ty = ref(0);
const pointers = new Map();
let pinchStart = null;
let swipeStart = null;

const altText = computed(() => `${props.title} photo ${props.index + 1}`);

const imgStyle = computed(() => {
  const s = scale.value;
  const x = tx.value;
  const y = ty.value;
  return {
    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${s})`,
    transformOrigin: 'center',
    transition: pointers.size ? 'none' : 'transform 220ms cubic-bezier(0.22, 1, 0.36, 1)',
  };
});

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function resetView() {
  imgLoaded.value = false;
  scale.value = 1;
  tx.value = 0;
  ty.value = 0;
  pointers.clear();
  pinchStart = null;
  swipeStart = null;
}

function prev() {
  if (props.images.length < 2) return;
  emit('update:index', (props.index - 1 + props.images.length) % props.images.length);
}

function next() {
  if (props.images.length < 2) return;
  emit('update:index', (props.index + 1) % props.images.length);
}

function toggleZoom() {
  if (scale.value === 1) scale.value = 2;
  else resetView();
}

function onWheel(e) {
  if (!props.open) return;
  const delta = e.deltaY > 0 ? -0.15 : 0.15;
  scale.value = clamp(scale.value + delta, 1, 3);
  if (scale.value === 1) {
    tx.value = 0;
    ty.value = 0;
  }
}

function onKeydown(e) {
  if (e.key === 'Escape') emit('close');
  if (e.key === 'ArrowLeft') prev();
  if (e.key === 'ArrowRight') next();
}

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function center(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function onPointerDown(e) {
  if (!props.open) return;
  stage.value?.setPointerCapture?.(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pointers.size === 1 && scale.value === 1) {
    swipeStart = { x: e.clientX, y: e.clientY };
  }

  if (pointers.size === 2) {
    const pts = Array.from(pointers.values());
    pinchStart = {
      dist: distance(pts[0], pts[1]),
      scale: scale.value,
      center: center(pts[0], pts[1]),
      tx: tx.value,
      ty: ty.value,
    };
  }
}

function onPointerMove(e) {
  if (!props.open) return;
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

  if (pointers.size === 2 && pinchStart) {
    const pts = Array.from(pointers.values());
    const distNow = distance(pts[0], pts[1]);
    const cNow = center(pts[0], pts[1]);
    const nextScale = clamp((distNow / Math.max(1, pinchStart.dist)) * pinchStart.scale, 1, 3);
    scale.value = nextScale;
    tx.value = pinchStart.tx + (cNow.x - pinchStart.center.x);
    ty.value = pinchStart.ty + (cNow.y - pinchStart.center.y);
    return;
  }

  if (pointers.size === 1) {
    const pt = pointers.get(e.pointerId);
    if (!pt) return;

    if (scale.value > 1) {
      tx.value += e.movementX;
      ty.value += e.movementY;
      return;
    }

    if (swipeStart) {
      const dx = pt.x - swipeStart.x;
      const dy = pt.y - swipeStart.y;
      if (Math.abs(dx) > 64 && Math.abs(dy) < 56) {
        swipeStart = null;
        if (dx < 0) next();
        else prev();
      }
    }
  }
}

function onPointerUp(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinchStart = null;
  if (pointers.size === 0) swipeStart = null;
}

watch(
  () => props.open,
  async (open) => {
    if (open) {
      resetView();
      await nextTick();
      stage.value?.focus?.();
      window.addEventListener('keydown', onKeydown, { passive: true });
    } else {
      window.removeEventListener('keydown', onKeydown);
      resetView();
    }
  }
);

watch(
  () => props.index,
  () => {
    resetView();
  }
);

onMounted(() => {
  if (props.open) stage.value?.focus?.();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown);
});
</script>

<style scoped>
.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .lightbox-enter-active,
  .lightbox-leave-active {
    transition: none !important;
  }
}
</style>

