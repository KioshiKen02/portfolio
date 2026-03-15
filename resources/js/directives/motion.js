function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  const mq = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)');
  return Boolean(mq && mq.matches);
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function normalizeBinding(value) {
  const v = value && typeof value === 'object' ? value : {};
  const revealRaw = v.reveal === false ? false : (v.reveal && typeof v.reveal === 'object' ? v.reveal : v);
  const parallaxRaw = v.parallax && typeof v.parallax === 'object' ? v.parallax : null;

  const reveal = revealRaw === false
    ? null
    : {
        x: Number(revealRaw.x ?? 0),
        y: Number(revealRaw.y ?? 16),
        scale: Number(revealRaw.scale ?? 1),
        durationMs: Number(revealRaw.durationMs ?? 700),
        delayMs: Number(revealRaw.delayMs ?? 0),
        easing: String(revealRaw.easing ?? 'cubic-bezier(0.22, 1, 0.36, 1)'),
        threshold: Number(revealRaw.threshold ?? 0.2),
        once: revealRaw.once !== false,
      };

  const parallax = parallaxRaw
    ? {
        speed: Number(parallaxRaw.speed ?? 0.08),
        max: Number(parallaxRaw.max ?? 28),
        axis: String(parallaxRaw.axis ?? 'y'),
      }
    : null;

  return { reveal, parallax };
}

export const motionDirective = {
  mounted(el, binding) {
    const { reveal, parallax } = normalizeBinding(binding?.value);
    const reduced = prefersReducedMotion();

    let revealTransform = 'translate3d(0,0,0) scale(1)';
    let parallaxTransform = '';
    let observer = null;
    let raf = 0;
    let rafPending = false;

    const applyTransform = () => {
      const t = `${revealTransform}${parallaxTransform ? ` ${parallaxTransform}` : ''}`.trim();
      el.style.transform = t;
    };

    const cleanup = () => {
      if (observer) observer.disconnect?.();
      observer = null;
      if (raf) window.cancelAnimationFrame(raf);
      raf = 0;
      rafPending = false;
      window.removeEventListener('scroll', onScroll, { passive: true });
      window.removeEventListener('resize', onScroll, { passive: true });
      delete el.__motionCleanup;
    };

    el.__motionCleanup = cleanup;

    if (!reveal || reduced) {
      el.style.opacity = '';
      revealTransform = 'translate3d(0,0,0) scale(1)';
      applyTransform();
    } else {
      const supportsIO = typeof window !== 'undefined' && 'IntersectionObserver' in window;

      el.style.willChange = 'transform, opacity';
      el.style.transitionProperty = 'transform, opacity';
      el.style.transitionDuration = `${Math.max(0, reveal.durationMs)}ms`;
      el.style.transitionTimingFunction = reveal.easing;
      el.style.transitionDelay = `${Math.max(0, reveal.delayMs)}ms`;

      el.style.opacity = '0';
      revealTransform = `translate3d(${reveal.x}px, ${reveal.y}px, 0) scale(${reveal.scale})`;
      applyTransform();

      if (!supportsIO) {
        el.style.opacity = '1';
        revealTransform = 'translate3d(0,0,0) scale(1)';
        applyTransform();
        el.style.willChange = '';
      } else {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              el.style.opacity = '1';
              revealTransform = 'translate3d(0,0,0) scale(1)';
              applyTransform();
              window.setTimeout(() => {
                if (el) el.style.willChange = '';
              }, Math.max(0, reveal.durationMs + reveal.delayMs));
              if (reveal.once) observer.unobserve(el);
            });
          },
          { threshold: reveal.threshold }
        );
        observer.observe(el);
      }
    }

    function computeParallax() {
      if (!parallax || reduced) return;
      const vh = window.innerHeight || 1;
      const rect = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const delta = center - vh / 2;
      const raw = -delta * parallax.speed;
      const clamped = clamp(raw, -parallax.max, parallax.max);
      parallaxTransform = parallax.axis === 'x'
        ? `translate3d(${clamped}px, 0, 0)`
        : `translate3d(0, ${clamped}px, 0)`;
      applyTransform();
    }

    function onScroll() {
      if (!parallax || reduced) return;
      if (rafPending) return;
      rafPending = true;
      raf = window.requestAnimationFrame(() => {
        rafPending = false;
        computeParallax();
      });
    }

    if (parallax && !reduced) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      onScroll();
    }
  },

  updated(el, binding) {
    if (el.__motionCleanup) el.__motionCleanup();
    motionDirective.mounted(el, binding);
  },

  unmounted(el) {
    if (el.__motionCleanup) el.__motionCleanup();
  },
};

