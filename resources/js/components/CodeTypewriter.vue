<template>
  <div class="relative w-full">
    <pre
      v-if="reserveSpace"
      aria-hidden="true"
      class="ctw-reserve m-0 whitespace-pre font-mono text-xs leading-relaxed text-transparent sm:text-sm"
    >{{ fullText }}</pre>

    <pre
      class="ctw-live m-0 whitespace-pre font-mono text-xs leading-relaxed text-slate-200 sm:text-sm"
      :class="reserveSpace ? 'absolute inset-0' : ''"
    >
      <span v-html="visibleHtml"></span><span v-if="showCursor" class="ctw-cursor">|</span>
    </pre>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  text: { type: String, default: '' },
  highlight: { type: Boolean, default: true },
  disabled: { type: Boolean, default: false },
  loop: { type: Boolean, default: true },
  startDelayMs: { type: Number, default: 300 },
  minCharDelayMs: { type: Number, default: 18 },
  maxCharDelayMs: { type: Number, default: 62 },
  newlineDelayMs: { type: Number, default: 220 },
  randomizeDelays: { type: Boolean, default: true },
  pauseAfterFinishMs: { type: Number, default: 1600 },
  reserveSpace: { type: Boolean, default: true },
});

const prefersReducedMotion = ref(false);
const visibleText = ref('');
const running = ref(false);

let timer = 0;

const fullText = computed(() => String(props.text || ''));
const animate = computed(() => !props.disabled && !prefersReducedMotion.value && Boolean(fullText.value));
const showCursor = computed(() => Boolean(fullText.value) && !prefersReducedMotion.value);

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function tokenize(source) {
  const s = String(source || '');
  const tokens = [];
  let i = 0;
  let lastKeyword = '';

  const isAlpha = (c) => /[A-Za-z_]/.test(c);
  const isAlnum = (c) => /[A-Za-z0-9_]/.test(c);
  const keywords = new Set(['class', 'extends', 'public', 'function', 'return']);

  while (i < s.length) {
    const ch = s[i];

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === '\\') {
          j += 2;
          continue;
        }
        if (s[j] === quote) {
          j += 1;
          break;
        }
        j += 1;
      }
      tokens.push({ type: 'string', value: s.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === '$') {
      let j = i + 1;
      while (j < s.length && isAlnum(s[j])) j += 1;
      tokens.push({ type: 'variable', value: s.slice(i, j) });
      i = j;
      continue;
    }

    if (isAlpha(ch)) {
      let j = i + 1;
      while (j < s.length && isAlnum(s[j])) j += 1;
      const word = s.slice(i, j);

      if (keywords.has(word)) {
        tokens.push({ type: 'keyword', value: word });
        lastKeyword = word;
      } else if (lastKeyword === 'function') {
        tokens.push({ type: 'functionName', value: word });
        lastKeyword = '';
      } else if (lastKeyword === 'extends' || lastKeyword === 'class') {
        tokens.push({ type: 'typeName', value: word });
        lastKeyword = '';
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ type: 'typeName', value: word });
        lastKeyword = '';
      } else {
        tokens.push({ type: 'plain', value: word });
        lastKeyword = '';
      }

      i = j;
      continue;
    }

    tokens.push({ type: 'plain', value: ch });
    if (ch !== ' ' && ch !== '\n' && ch !== '\t') lastKeyword = '';
    i += 1;
  }

  return tokens;
}

function renderHighlightedHtml(tokens, limit) {
  let out = '';
  let count = 0;

  const wrap = (cls, v) => `<span class="${cls}">${escapeHtml(v)}</span>`;
  const clsFor = (t) => {
    if (t === 'keyword') return 'text-pink-400';
    if (t === 'typeName') return 'text-yellow-200';
    if (t === 'functionName') return 'text-blue-300';
    if (t === 'variable') return 'text-purple-300';
    if (t === 'string') return 'text-emerald-300';
    return '';
  };

  for (const tok of tokens) {
    if (count >= limit) break;
    const remaining = limit - count;
    const slice = tok.value.slice(0, remaining);
    const cls = clsFor(tok.type);
    out += cls ? wrap(cls, slice) : escapeHtml(slice);
    count += slice.length;
  }

  return out;
}

const tokens = computed(() => tokenize(fullText.value));

const visibleHtml = computed(() => {
  const txt = visibleText.value;
  if (!props.highlight) return escapeHtml(txt);
  return renderHighlightedHtml(tokens.value, txt.length);
});

function clearTimer() {
  if (timer) window.clearTimeout(timer);
  timer = 0;
}

function randInt(min, max) {
  const a = Math.ceil(min);
  const b = Math.floor(max);
  return Math.floor(Math.random() * (b - a + 1)) + a;
}

function nextDelay(ch) {
  if (ch === '\n') return props.newlineDelayMs;
  if (props.randomizeDelays) {
    if (ch === '.' || ch === ',' || ch === ';' || ch === ':' || ch === ')') return randInt(70, 140);
    if (ch === ' ') return randInt(10, 30);
    return randInt(props.minCharDelayMs, props.maxCharDelayMs);
  }
  if (ch === '.' || ch === ',' || ch === ';' || ch === ':' || ch === ')') return 100;
  if (ch === ' ') return 20;
  return props.minCharDelayMs;
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

function runOnce() {
  clearTimer();
  running.value = true;
  visibleText.value = '';

  const target = fullText.value;
  if (!animate.value) {
    visibleText.value = target;
    running.value = false;
    return;
  }

  let i = 0;
  const step = () => {
    if (!animate.value) {
      visibleText.value = target;
      running.value = false;
      return;
    }

    i += 1;
    visibleText.value = target.slice(0, i);

    if (i >= target.length) {
      running.value = false;
      if (props.loop) {
        schedule(() => runOnce(), props.pauseAfterFinishMs);
      }
      return;
    }

    const nextChar = target.charAt(i);
    schedule(step, nextDelay(nextChar));
  };

  schedule(step, props.startDelayMs);
}

syncReducedMotion();

onMounted(() => {
  runOnce();
});

onBeforeUnmount(() => clearTimer());

watch(
  () => [props.text, props.disabled, props.loop, props.startDelayMs, props.minCharDelayMs, props.maxCharDelayMs, props.newlineDelayMs, props.pauseAfterFinishMs, props.reserveSpace, animate.value],
  () => runOnce(),
  { deep: false }
);
</script>

<style scoped>
.ctw-cursor {
  display: inline-block;
  width: 1ch;
  margin-left: 1px;
  animation: ctw-blink 1s steps(2, start) infinite;
}

@keyframes ctw-blink {
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
  .ctw-cursor {
    animation: none !important;
    opacity: 0 !important;
  }
}
</style>
