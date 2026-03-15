  <template>
  <span ref="root" class="relative z-10 inline-block align-baseline overflow-visible" :style="rootStyle">
    <span v-if="reserveSpace" aria-hidden="true" class="rtw-reserve block opacity-0">
      <span class="rtw-line1 whitespace-pre">{{ reserveLine1 }}</span>
      <br />
      <span class="rtw-line2 whitespace-pre">{{ reserveLine2 }}</span>
    </span>

    <span class="rtw-live block" :class="reserveSpace ? 'absolute inset-0' : ''">
      <span class="rtw-line1 whitespace-pre">
        {{ liveLine1 }}
        <span v-if="showCursor && cursorOnLine1" aria-hidden="true" class="rtw-cursor">|</span>
      </span>
      <br />
      <span class="rtw-line2 whitespace-pre">
        {{ liveLine2 }}
        <span v-if="showCursor && !cursorOnLine1" aria-hidden="true" class="rtw-cursor">|</span>
      </span>
    </span>
  </span>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  phrases: { type: Array, default: () => [] },
  typingMs: { type: Number, default: 120 },
  deletingMs: { type: Number, default: 120 },
  pauseMs: { type: Number, default: 650 },
  startDelayMs: { type: Number, default: 120 },
  loop: { type: Boolean, default: true },
  reserveSpace: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  minScale: { type: Number, default: 0.68 },
  maxScale: { type: Number, default: 1 },
  minLineHeight: { type: Number, default: 1.02 },
  maxLineHeight: { type: Number, default: 1.22 },
  testWidthPx: { type: Number, default: 0 },
  baseFontSizePx: { type: Number, default: 0 },
  measureTextFn: { type: Function, default: null },
});

const root = ref(null);
const prefersReducedMotion = ref(false);
const visible = ref('');
const phraseIdx = ref(0);
const charIdx = ref(0);
const mode = ref('typing'); // typing | pausing | deleting

let timer = 0;
let ro = null;

const widthPx = ref(0);
const fontSizePx = ref(0);
const lineHeight = ref(1.08);
const fontFamily = ref('');
const fontWeight = ref('');

function clearTimer() {
  if (timer) window.clearTimeout(timer);
  timer = 0;
}

function schedule(fn, ms) {
  clearTimer();
  timer = window.setTimeout(fn, Math.max(0, ms));
}

function syncReducedMotion() {
  if (typeof window === 'undefined') return;
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  prefersReducedMotion.value = Boolean(mq && mq.matches);
}

const normalizedPhrases = computed(() => {
  const list = Array.isArray(props.phrases) ? props.phrases : [];
  return list.map((p) => String(p ?? '')).filter(Boolean);
});

const activePhrase = computed(() => normalizedPhrases.value[phraseIdx.value] || '');

const reserveText = computed(() => {
  const list = normalizedPhrases.value;
  if (!list.length) return '';
  return list.reduce((a, b) => (a.length >= b.length ? a : b), '');
});

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function escapeForMeasure(s) {
  return String(s ?? '');
}

function canvasMeasure(text, font) {
  if (typeof document === 'undefined') return text.length * 10;
  const c = document.createElement('canvas');
  const ctx = c.getContext && c.getContext('2d');
  if (!ctx) return text.length * 10;
  ctx.font = font;
  const m = ctx.measureText(text);
  return m && typeof m.width === 'number' ? m.width : text.length * 10;
}

function measureWidth(text, scale) {
  const base = fontSizePx.value || props.baseFontSizePx || 0;
  const px = Math.max(1, base * scale);
  const fam = fontFamily.value || 'system-ui';
  const w = fontWeight.value || '700';
  const font = `${w} ${px}px ${fam}`;
  const s = escapeForMeasure(text);
  if (props.measureTextFn) return Number(props.measureTextFn(s, font)) || 0;
  return canvasMeasure(s, font);
}

function breakCandidates(text) {
  const s = String(text || '');
  const out = [];
  for (let i = 1; i < s.length; i += 1) {
    const ch = s[i];
    if (ch === ' ' || ch === '-' || ch === '—' || ch === '–' || ch === '/' || ch === '·') out.push(i);
  }
  if (out.length) return out;
  for (let i = 1; i < s.length; i += 1) out.push(i);
  return out;
}

function splitAt(text, idx) {
  const s = String(text || '');
  const ch = s[idx];
  if (ch === ' ') {
    return { line1: s.slice(0, idx).trimEnd(), line2: s.slice(idx + 1).trimStart(), cursorSplitIdx: idx };
  }
  return { line1: s.slice(0, idx), line2: s.slice(idx), cursorSplitIdx: idx };
}

function findBestBreak(text, scale, maxWidth) {
  const s = String(text || '');
  if (!s) return null;
  const candidates = breakCandidates(s);
  let best = null;
  let bestScore = Number.POSITIVE_INFINITY;

  for (const idx of candidates) {
    const { line1, line2 } = splitAt(s, idx);
    if (!line1 || !line2) continue;
    const w1 = measureWidth(line1, scale);
    const w2 = measureWidth(line2, scale);
    const m = Math.max(w1, w2);
    if (m > maxWidth) continue;
    const score = Math.abs(w1 - w2) + m * 0.01;
    if (score < bestScore) {
      bestScore = score;
      best = idx;
    }
  }

  return best;
}

function canFitTwoLines(text, scale, maxWidth) {
  const idx = findBestBreak(text, scale, maxWidth);
  if (idx != null) return true;
  const w = measureWidth(String(text || ''), scale);
  return w <= maxWidth;
}

function computeScaleToFit(text, maxWidth) {
  const t = String(text || '');
  if (!t) return props.maxScale;
  const loMin = clamp(props.minScale, 0.4, 1);
  const hiMax = clamp(props.maxScale, loMin, 1.2);

  let lo = loMin;
  let hi = hiMax;
  let best = loMin;

  for (let i = 0; i < 10; i += 1) {
    const mid = (lo + hi) / 2;
    if (canFitTwoLines(t, mid, maxWidth)) {
      best = mid;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return clamp(best, loMin, hiMax);
}

const layoutScale = ref(1);
const breakIdx = ref(null);
const reserveBreakIdx = ref(null);

function updateLayout() {
  const w = props.testWidthPx > 0 ? props.testWidthPx : widthPx.value;
  if (!w) return;
  const baseText = reserveText.value || activePhrase.value || '';
  const scale = computeScaleToFit(baseText, w);
  layoutScale.value = scale;
  lineHeight.value = clamp(
    props.minLineHeight + (1 - scale) * 0.35,
    props.minLineHeight,
    props.maxLineHeight
  );
  reserveBreakIdx.value = findBestBreak(baseText, scale, w);
  breakIdx.value = findBestBreak(activePhrase.value, scale, w) ?? reserveBreakIdx.value;
}

function readMetrics() {
  if (props.baseFontSizePx) fontSizePx.value = props.baseFontSizePx;
  if (!root.value || typeof window === 'undefined') return;
  const cs = window.getComputedStyle(root.value);
  const fs = Number.parseFloat(cs.fontSize || '');
  if (!Number.isNaN(fs) && fs > 0) fontSizePx.value = fs;
  fontFamily.value = cs.fontFamily || '';
  fontWeight.value = cs.fontWeight || '';
}

function readWidth() {
  const w = props.testWidthPx > 0 ? props.testWidthPx : 0;
  if (w > 0) {
    widthPx.value = w;
    return;
  }
  if (!root.value) return;
  const host = root.value.parentElement || root.value;
  const r = host.getBoundingClientRect && host.getBoundingClientRect();
  if (r && typeof r.width === 'number') widthPx.value = r.width;
}

const animate = computed(() => {
  return !props.disabled && !prefersReducedMotion.value && normalizedPhrases.value.length > 0;
});

const showCursor = computed(() => normalizedPhrases.value.length > 0 && !prefersReducedMotion.value);

const rootStyle = computed(() => {
  const base = fontSizePx.value || props.baseFontSizePx || 0;
  const px = base ? base * layoutScale.value : undefined;
  return {
    fontSize: px ? `${px}px` : undefined,
    lineHeight: String(lineHeight.value),
  };
});

const activeSplit = computed(() => {
  const phrase = activePhrase.value || '';
  const idx = breakIdx.value;
  if (idx == null || idx <= 0 || idx >= phrase.length) return { idx: null, line1: phrase, line2: '' };
  const { line1, line2, cursorSplitIdx } = splitAt(phrase, idx);
  return { idx: cursorSplitIdx, line1, line2 };
});

const reserveSplit = computed(() => {
  const phrase = reserveText.value || '';
  const idx = reserveBreakIdx.value ?? findBestBreak(phrase, layoutScale.value, props.testWidthPx || widthPx.value || 0);
  if (idx == null || idx <= 0 || idx >= phrase.length) return { line1: phrase, line2: '' };
  const { line1, line2 } = splitAt(phrase, idx);
  return { line1, line2 };
});

function visibleLines() {
  const v = String(visible.value || '');
  const phrase = activePhrase.value || '';
  const split = activeSplit.value;
  if (!split.idx || !phrase) return { line1: v, line2: '' };
  const idx = split.idx;
  const line1Full = split.line1;
  const line2Full = split.line2;

  const line1Len = line1Full.length;
  if (v.length <= line1Len) return { line1: v, line2: '' };
  const tail = v.slice(line1Len);
  const line2 = line2Full.slice(0, Math.max(0, tail.length));
  return { line1: line1Full, line2 };
}

const liveLine1 = computed(() => visibleLines().line1);
const liveLine2 = computed(() => visibleLines().line2);
const reserveLine1 = computed(() => reserveSplit.value.line1);
const reserveLine2 = computed(() => reserveSplit.value.line2);

const cursorOnLine1 = computed(() => {
  const split = activeSplit.value;
  if (!split.idx) return true;
  return String(visible.value || '').length <= split.line1.length;
});

function reset() {
  visible.value = '';
  phraseIdx.value = 0;
  charIdx.value = 0;
  mode.value = 'typing';
}

function start() {
  reset();
  if (!animate.value) {
    visible.value = activePhrase.value;
    return;
  }
  if (props.startDelayMs <= 0) {
    step();
    return;
  }
  schedule(step, props.startDelayMs);
}

function step() {
  if (!normalizedPhrases.value.length) {
    visible.value = '';
    return;
  }

  if (!animate.value) {
    visible.value = activePhrase.value;
    return;
  }

  const phrase = activePhrase.value;

  if (mode.value === 'typing') {
    charIdx.value = Math.min(phrase.length, charIdx.value + 1);
    visible.value = phrase.slice(0, charIdx.value);

    if (charIdx.value >= phrase.length) {
      mode.value = 'pausing';
      schedule(step, props.pauseMs);
      return;
    }

    schedule(step, props.typingMs);
    return;
  }

  if (mode.value === 'pausing') {
    mode.value = 'deleting';
    schedule(step, props.deletingMs);
    return;
  }

  if (mode.value === 'deleting') {
    charIdx.value = Math.max(0, charIdx.value - 1);
    visible.value = phrase.slice(0, charIdx.value);

    if (charIdx.value <= 0) {
      const next = (phraseIdx.value + 1) % normalizedPhrases.value.length;
      const isLast = phraseIdx.value === normalizedPhrases.value.length - 1;
      phraseIdx.value = next;
      mode.value = 'typing';

      if (!props.loop && isLast) {
        visible.value = normalizedPhrases.value[normalizedPhrases.value.length - 1] || '';
        clearTimer();
        return;
      }

      schedule(step, props.startDelayMs);
      return;
    }

    schedule(step, props.deletingMs);
  }
}

syncReducedMotion();

onBeforeUnmount(() => clearTimer());

onMounted(() => {
  readMetrics();
  readWidth();
  updateLayout();

  if (typeof window !== 'undefined') {
    if ('ResizeObserver' in window && root.value) {
      ro = new ResizeObserver(() => {
        readMetrics();
        readWidth();
        updateLayout();
      });
      ro.observe(root.value.parentElement || root.value);
    } else {
      window.addEventListener('resize', onResize, { passive: true });
    }
  }
});

function onResize() {
  readMetrics();
  readWidth();
  updateLayout();
}

onBeforeUnmount(() => {
  if (ro) ro.disconnect();
  ro = null;
  if (typeof window !== 'undefined') window.removeEventListener('resize', onResize, { passive: true });
});

watch(
  () => [
    normalizedPhrases.value.join('\u0000'),
    props.typingMs,
    props.deletingMs,
    props.pauseMs,
    props.startDelayMs,
    props.loop,
    props.reserveSpace,
    props.disabled,
    props.minScale,
    props.maxScale,
    props.minLineHeight,
    props.maxLineHeight,
    props.testWidthPx,
    props.baseFontSizePx,
    props.measureTextFn,
    animate.value,
  ],
  () => {
    readMetrics();
    readWidth();
    updateLayout();
    start();
  },
  { deep: false, immediate: true }
);
</script>

<style scoped>
.rtw-cursor {
  display: inline-block;
  width: 1ch;
  margin-left: 1px;
  animation: rtw-blink 1s steps(2, start) infinite;
}

@keyframes rtw-blink {
  0%,
  45% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .rtw-cursor {
    animation: none !important;
    opacity: 0 !important;
  }
}
</style>
