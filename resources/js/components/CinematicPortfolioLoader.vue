<template>
  <div class="cinematic relative w-full max-w-[44rem]">
    <canvas
      ref="canvasRef"
      class="absolute inset-0 h-full w-full rounded-[2.75rem]"
      aria-hidden="true"
    ></canvas>

    <div
      class="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-slate-950/40 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl"
      :class="state === 'success' ? 'cinematic-success' : state === 'error' ? 'cinematic-error' : ''"
    >
      <div class="absolute -inset-24 opacity-70 pointer-events-none" aria-hidden="true">
        <div class="aurora aurora-a"></div>
        <div class="aurora aurora-b"></div>
        <div class="aurora aurora-c"></div>
      </div>

      <div class="relative flex flex-col gap-8">
        <div class="flex items-start justify-between gap-6">
          <div class="min-w-0">
            <p class="text-[10px] font-black uppercase tracking-[0.32em] text-white/60">Runtime Sequence</p>
            <h2 class="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-white">
              {{ title }}
            </h2>
            <p class="mt-2 text-sm font-semibold text-white/70">
              {{ subtitle }}
            </p>
          </div>

          <div class="shrink-0">
            <div class="emblem" aria-hidden="true">
              <svg class="emblem-svg" viewBox="0 0 120 120" fill="none">
                <path
                  :d="emblemPath"
                  class="emblem-path"
                />
              </svg>
              <div class="emblem-glow"></div>
            </div>
          </div>
        </div>

        <div class="grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
          <div class="min-w-0">
            <div class="flex items-center justify-between gap-4">
              <div class="min-w-0">
                <p class="text-xs font-black uppercase tracking-[0.28em]" :class="statusTone">
                  {{ statusLabel }}
                </p>
                <p class="mt-1 text-sm font-semibold text-white/70 truncate">
                  {{ statusDetail }}
                </p>
              </div>
              <p class="text-xs font-black text-white/70 tabular-nums">{{ displayProgress }}%</p>
            </div>

            <div class="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                class="h-full w-full origin-left rounded-full"
                :class="barTone"
                :style="{ transform: `scaleX(${Math.max(0, Math.min(1, displayProgress / 100))})` }"
              ></div>
            </div>

            <div class="mt-5 grid gap-2">
              <div
                v-for="line in visibleLog"
                :key="line.id"
                class="log-line flex items-center justify-between gap-4"
              >
                <span class="log-left truncate">
                  <span class="log-dot" :class="line.tone" aria-hidden="true"></span>
                  {{ line.text }}
                </span>
                <span class="log-right tabular-nums">{{ line.time }}</span>
              </div>
            </div>
          </div>

          <div class="sm:w-[12.5rem]">
            <div class="ring">
              <div class="ring-core" :style="{ '--p': displayProgress }"></div>
              <div class="ring-inset"></div>
              <div class="ring-label">
                <p class="text-[10px] font-black uppercase tracking-[0.28em] text-white/60">Core</p>
                <p class="mt-1 text-lg font-black text-white">{{ stateLabel }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <div class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
            <span class="chip">CSS</span>
            <span class="chip">Canvas</span>
            <span class="chip">Morph</span>
            <span class="chip">A11y</span>
          </div>

          <div class="text-[10px] font-black uppercase tracking-[0.28em] text-white/50">
            <span class="inline-flex items-center gap-2">
              <span class="pulse-dot" aria-hidden="true"></span>
              {{ footerLabel }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  state: {
    type: String,
    default: 'loading',
  },
  title: {
    type: String,
    default: 'Welcome To My Portfolio',
  },
  subtitle: {
    type: String,
    default: 'Bootstrapping the experience graph and rendering the interface…',
  },
  progress: {
    type: Number,
    default: null,
  }
});

const canvasRef = ref(null);
const prefersReducedMotion = ref(false);

const displayProgress = ref(0);
const lastTick = ref(performance.now());

const pointer = ref({ x: 0.5, y: 0.5 });

const stateLabel = computed(() => {
  if (props.state === 'success') return 'Ready';
  if (props.state === 'error') return 'Degraded';
  return 'Loading';
});

const statusLabel = computed(() => {
  if (props.state === 'success') return 'Handshake Complete';
  if (props.state === 'error') return 'Recovery Mode';
  return 'Systems Online';
});

const footerLabel = computed(() => {
  if (props.state === 'success') return 'Transitioning';
  if (props.state === 'error') return 'Awaiting Retry';
  return 'Calibrating';
});

const statusTone = computed(() => {
  if (props.state === 'success') return 'text-emerald-300';
  if (props.state === 'error') return 'text-rose-300';
  return 'text-indigo-300';
});

const barTone = computed(() => {
  if (props.state === 'success') return 'bar bar-success';
  if (props.state === 'error') return 'bar bar-error';
  return 'bar bar-loading';
});

const statusDetail = computed(() => {
  if (props.state === 'success') return 'Rendering complete. Preparing seamless entry.';
  if (props.state === 'error') return 'Some resources failed. UI remains responsive.';
  if (displayProgress.value < 35) return 'Mapping interface primitives and motion layers.';
  if (displayProgress.value < 70) return 'Hydrating modules and resolving data contracts.';
  return 'Optimizing visuals for 60fps and fast paint.';
});

const nowClock = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
};

const baseLog = ref([
  { id: 'a', text: 'Allocating GPU-friendly layers', tone: 'tone-loading', time: nowClock() },
  { id: 'b', text: 'Validating API schema integrity', tone: 'tone-loading', time: nowClock() },
  { id: 'c', text: 'Compiling UI system tokens', tone: 'tone-loading', time: nowClock() },
  { id: 'd', text: 'Streaming assets under 100KB budget', tone: 'tone-loading', time: nowClock() },
  { id: 'e', text: 'Preparing transition choreography', tone: 'tone-loading', time: nowClock() },
]);

const visibleLog = computed(() => {
  const p = displayProgress.value;
  const count = p < 20 ? 2 : p < 45 ? 3 : p < 75 ? 4 : 5;
  return baseLog.value.slice(0, count);
});

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

watch(() => props.progress, (p) => {
  if (typeof p === 'number' && !Number.isNaN(p)) {
    displayProgress.value = clamp(Math.round(p), 0, 100);
  }
});

watch(() => props.state, (s) => {
  if (s === 'success') {
    displayProgress.value = 100;
    baseLog.value = baseLog.value.map((l) => ({ ...l, tone: 'tone-success', time: nowClock() }));
  }
  if (s === 'error') {
    displayProgress.value = Math.max(displayProgress.value, 78);
    baseLog.value = baseLog.value.map((l, idx) => ({ ...l, tone: idx < 2 ? 'tone-success' : 'tone-error', time: nowClock() }));
  }
});

let rafId = 0;
let ctx = null;
let particles = [];

const emblemPath = ref('');

const makePath = (t, mx, my) => {
  const cx = 60;
  const cy = 60;
  const points = 18;
  const baseR = 34;
  const wobble = 6;
  const phase = t * 0.0015;
  const px = (mx - 0.5) * 2;
  const py = (my - 0.5) * 2;
  const verts = [];

  for (let i = 0; i < points; i++) {
    const a = (i / points) * Math.PI * 2;
    const n = Math.sin(a * 2 + phase) * 0.55 + Math.sin(a * 3 - phase * 1.4) * 0.35;
    const r = baseR + n * wobble + Math.sin(phase + i) * 1.2;
    const x = cx + Math.cos(a) * r + px * 4;
    const y = cy + Math.sin(a) * r + py * 4;
    verts.push([x, y]);
  }

  for (let i = 0; i < verts.length; i++) {
    const [x0, y0] = verts[i];
    const [x1, y1] = verts[(i + 1) % verts.length];
    const mxp = (x0 + x1) / 2;
    const myp = (y0 + y1) / 2;
    verts[i] = [mxp, myp];
  }

  let d = `M ${verts[0][0].toFixed(2)} ${verts[0][1].toFixed(2)}`;
  for (let i = 1; i < verts.length; i++) {
    d += ` L ${verts[i][0].toFixed(2)} ${verts[i][1].toFixed(2)}`;
  }
  d += ' Z';
  return d;
};

const resizeCanvas = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = Math.max(1, Math.floor(rect.width * dpr));
  canvas.height = Math.max(1, Math.floor(rect.height * dpr));
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
  ctx = canvas.getContext('2d');
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
};

const seedParticles = () => {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const count = Math.round(Math.min(52, Math.max(28, (rect.width * rect.height) / 18000)));
  particles = Array.from({ length: count }).map(() => ({
    x: Math.random() * rect.width,
    y: Math.random() * rect.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: 0.8 + Math.random() * 1.8,
    a: 0.25 + Math.random() * 0.45,
    h: 220 + Math.random() * 80,
  }));
};

const paint = (t) => {
  rafId = requestAnimationFrame(paint);
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  const rect = canvas.getBoundingClientRect();
  const dt = Math.min(40, t - lastTick.value);
  lastTick.value = t;

  const m = pointer.value;
  emblemPath.value = makePath(t, m.x, m.y);

  if (props.progress == null && props.state === 'loading') {
    const v = displayProgress.value;
    const step = 0.012 * dt + (v < 55 ? 0.028 * dt : v < 80 ? 0.018 * dt : 0.010 * dt);
    displayProgress.value = clamp(Math.round((v + step) * 10) / 10, 0, 94);
  }

  ctx.clearRect(0, 0, rect.width, rect.height);

  const grad = ctx.createLinearGradient(0, 0, rect.width, rect.height);
  grad.addColorStop(0, 'rgba(99,102,241,0.10)');
  grad.addColorStop(0.55, 'rgba(16,185,129,0.06)');
  grad.addColorStop(1, 'rgba(244,63,94,0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, rect.width, rect.height);

  const ax = (m.x - 0.5) * 0.22;
  const ay = (m.y - 0.5) * 0.22;

  for (const p of particles) {
    p.vx += ax * 0.0007 * dt;
    p.vy += ay * 0.0007 * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.x < -10) p.x = rect.width + 10;
    if (p.x > rect.width + 10) p.x = -10;
    if (p.y < -10) p.y = rect.height + 10;
    if (p.y > rect.height + 10) p.y = -10;

    const pulse = 0.6 + 0.4 * Math.sin((t * 0.002) + p.x * 0.01);
    ctx.beginPath();
    ctx.fillStyle = `hsla(${p.h}, 90%, 70%, ${(p.a * pulse).toFixed(3)})`;
    ctx.arc(p.x, p.y, p.r * pulse, 0, Math.PI * 2);
    ctx.fill();
  }

  const linkDist = Math.min(170, Math.max(110, rect.width * 0.3));
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < linkDist) {
        const alpha = (1 - d / linkDist) * 0.08;
        ctx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
};

const attachPointer = () => {
  const el = canvasRef.value;
  if (!el) return () => {};

  const onMove = (ev) => {
    const rect = el.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width;
    const y = (ev.clientY - rect.top) / rect.height;
    pointer.value = { x: clamp(x, 0, 1), y: clamp(y, 0, 1) };
  };

  const onLeave = () => {
    pointer.value = { x: 0.5, y: 0.5 };
  };

  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);

  return () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerleave', onLeave);
  };
};

let detachPointerHandler = () => {};
let resizeObserver = null;

onMounted(() => {
  const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = mq ? mq.matches : false;
  const onChange = (e) => (prefersReducedMotion.value = e.matches);
  mq?.addEventListener?.('change', onChange);

  resizeCanvas();
  seedParticles();

  if (!prefersReducedMotion.value && canvasRef.value?.getContext) {
    detachPointerHandler = attachPointer();
    rafId = requestAnimationFrame(paint);
  } else {
    emblemPath.value = makePath(performance.now(), 0.5, 0.5);
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
      seedParticles();
    });
    if (canvasRef.value) resizeObserver.observe(canvasRef.value);
  } else {
    window.addEventListener('resize', resizeCanvas, { passive: true });
  }

  return () => {
    mq?.removeEventListener?.('change', onChange);
  };
});

onBeforeUnmount(() => {
  cancelAnimationFrame(rafId);
  detachPointerHandler();
  if (resizeObserver && canvasRef.value) resizeObserver.unobserve(canvasRef.value);
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<style scoped>
.cinematic {
  transform: translateZ(0);
}

.aurora {
  position: absolute;
  inset: -20%;
  filter: blur(60px);
  opacity: 0.75;
  mix-blend-mode: screen;
  transform: translate3d(0, 0, 0);
}

.aurora-a {
  background: radial-gradient(closest-side, rgba(99,102,241,0.55), rgba(99,102,241,0));
  animation: driftA 6.2s ease-in-out infinite;
}

.aurora-b {
  background: radial-gradient(closest-side, rgba(16,185,129,0.45), rgba(16,185,129,0));
  animation: driftB 7.8s ease-in-out infinite;
}

.aurora-c {
  background: radial-gradient(closest-side, rgba(244,63,94,0.40), rgba(244,63,94,0));
  animation: driftC 8.6s ease-in-out infinite;
}

@keyframes driftA {
  0%, 100% { transform: translate3d(-6%, -2%, 0) scale(1.05); }
  50% { transform: translate3d(10%, 4%, 0) scale(1.18); }
}

@keyframes driftB {
  0%, 100% { transform: translate3d(8%, 10%, 0) scale(1.12); }
  50% { transform: translate3d(-10%, -6%, 0) scale(1.22); }
}

@keyframes driftC {
  0%, 100% { transform: translate3d(2%, -10%, 0) scale(1.08); }
  50% { transform: translate3d(-6%, 12%, 0) scale(1.25); }
}

.emblem {
  position: relative;
  height: 4.75rem;
  width: 4.75rem;
  border-radius: 1.75rem;
  background: radial-gradient(circle at 30% 30%, rgba(129,140,248,0.22), rgba(2,6,23,0.10));
  border: 1px solid rgba(255,255,255,0.12);
  overflow: hidden;
}

.emblem-svg {
  position: absolute;
  inset: 0;
  padding: 0.75rem;
}

.emblem-path {
  fill: rgba(99,102,241,0.18);
  stroke: rgba(255,255,255,0.75);
  stroke-width: 1.4;
  filter: drop-shadow(0 10px 22px rgba(99,102,241,0.25));
}

.emblem-glow {
  position: absolute;
  inset: -30%;
  background: conic-gradient(from 90deg, rgba(99,102,241,0), rgba(99,102,241,0.5), rgba(16,185,129,0.35), rgba(244,63,94,0.35), rgba(99,102,241,0));
  animation: glowSpin 5.2s linear infinite;
  opacity: 0.55;
  filter: blur(24px);
}

@keyframes glowSpin {
  to { transform: rotate(360deg); }
}

.bar {
  transition: transform 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

.bar-loading {
  background: linear-gradient(90deg, rgba(99,102,241,1), rgba(129,140,248,1), rgba(16,185,129,1));
}

.bar-success {
  background: linear-gradient(90deg, rgba(16,185,129,1), rgba(52,211,153,1));
}

.bar-error {
  background: linear-gradient(90deg, rgba(244,63,94,1), rgba(251,113,133,1));
}

.log-line {
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 0.9rem;
  padding: 0.6rem 0.75rem;
  background: rgba(2,6,23,0.25);
}

.log-left {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.75rem;
  font-weight: 650;
  color: rgba(255,255,255,0.78);
}

.log-right {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  color: rgba(255,255,255,0.45);
}

.log-dot {
  height: 0.55rem;
  width: 0.55rem;
  border-radius: 999px;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.09);
}

.tone-loading { background: rgba(99,102,241,1); }
.tone-success { background: rgba(16,185,129,1); }
.tone-error { background: rgba(244,63,94,1); }

.ring {
  position: relative;
  height: 12.5rem;
  width: 12.5rem;
  margin-left: auto;
  margin-right: auto;
}

.ring-core {
  position: absolute;
  inset: 0;
  border-radius: 999px;
  background:
    conic-gradient(
      rgba(99,102,241,1) calc(var(--p) * 1%),
      rgba(255,255,255,0.08) 0
    );
  filter: drop-shadow(0 18px 36px rgba(99,102,241,0.15));
  transition: filter 280ms ease;
}

.ring-inset {
  position: absolute;
  inset: 10px;
  border-radius: 999px;
  background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.06), rgba(2,6,23,0.65));
  border: 1px solid rgba(255,255,255,0.10);
}

.ring-label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  padding: 0.35rem 0.6rem;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.10);
}

.pulse-dot {
  height: 0.5rem;
  width: 0.5rem;
  border-radius: 999px;
  background: rgba(99,102,241,1);
  box-shadow: 0 0 0 0 rgba(99,102,241,0.55);
  animation: ping 1.15s ease-in-out infinite;
}

@keyframes ping {
  0% { box-shadow: 0 0 0 0 rgba(99,102,241,0.55); opacity: 1; }
  70% { box-shadow: 0 0 0 10px rgba(99,102,241,0); opacity: 0.9; }
  100% { box-shadow: 0 0 0 14px rgba(99,102,241,0); opacity: 0.75; }
}

.cinematic-success .ring-core {
  background: conic-gradient(rgba(16,185,129,1) calc(var(--p) * 1%), rgba(255,255,255,0.08) 0);
  filter: drop-shadow(0 18px 36px rgba(16,185,129,0.18));
}

.cinematic-error .ring-core {
  background: conic-gradient(rgba(244,63,94,1) calc(var(--p) * 1%), rgba(255,255,255,0.08) 0);
  filter: drop-shadow(0 18px 36px rgba(244,63,94,0.18));
}

@media (prefers-reduced-motion: reduce) {
  .aurora-a,
  .aurora-b,
  .aurora-c,
  .emblem-glow,
  .pulse-dot {
    animation: none;
  }

  .bar {
    transition-duration: 0.1s;
  }
}
</style>
