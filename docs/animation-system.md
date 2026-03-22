# Animation System Documentation

This document outlines the comprehensive animation system implemented in the portfolio.

## Intro Animation Sequence

The intro animation sequence triggers on initial page load to engage users.

### Animation Types
- **Zoom-in**: Scales from 0.8 to 1.0 over 800ms. Used for hero image/code window.
- **Fade-in**: Opacity from 0 to 1 over 600ms. Used for section headings.
- **Slide-up**: Opacity 0 to 1 and translateY(50px) to 0 over 700ms. Used for hero text.

### Implementation
- **Component**: `IntroAnimation.vue`
- **Trigger**: `onMounted` hook in Vue.
- **Z-index**: 1-10.
- **Performance**: Uses `will-change: transform, opacity` and CSS transforms.
- **Cleanup**: `animationend` listener resets `will-change`.

## Global Loading Animation System

The portfolio features a sophisticated, multi-component loading system that coordinates various visual feedback mechanisms.

### Loader Collection
1. **Advanced Loader (`AdvancedLoader.vue`)**: Morphing SVG shapes for state-based feedback.
2. **Skeleton Screens (`SkeletonLoader.vue`)**: Shimmering placeholders that represent content structure before it arrives.
3. **Progress Indicators (`ProgressIndicator.vue`)**: Linear and circular bars with support for indeterminate and precise progress tracking.
4. **Particle Effects (`ParticleLoader.vue`)**: CSS-based particles that create a visually engaging background during long operations.
5. **Staggered Reveals (`StaggeredReveal.vue`)**: A container component that orchestrates the entrance of child elements with customizable delays and animations.
6. **Typing Loader (`TypingNameLoader.vue`)**: A sophisticated name-typing animation featuring realistic character-by-character reveals, blinking cursor, and smooth fade-in effects.

### Coordinator (`LoadingOverlay.vue`)
The coordinator manages which loader to show based on the context and duration of the operation.
- **Smart Selection**: Randomly selects between advanced morphing shapes, progress indicators, and the typing name loader for variety.
- **State Feedback**: Displays clear success or error messages after the loading operation completes.
- **Performance**: Guaranteed < 50ms frame time by using GPU-accelerated CSS properties (`transform`, `opacity`) and avoiding layout thrashing.

### Accessibility & UX
- **Reduced Motion**: All animations respect the `prefers-reduced-motion` system preference.
- **ARIA Compliance**: Proper `role="progressbar"`, `role="status"`, and `aria-live` attributes.
- **Micro-interactions**: Subtle pulses, flashes, and transitions that provide constant feedback without being distracting.

## Parallax Scrolling

Multi-layer depth movement for an immersive experience.

### Layer Speeds
- **Background**: 0.5x (slower than scroll).
- **Mid-ground**: 0.8x.
- **Foreground**: 1.2x (faster than scroll).

### Implementation
- **Component**: `ParallaxWrapper.vue`.
- **Mechanism**: Calculates `translate3d` based on `window.scrollY` and speed factor.
- **Performance**: Uses `requestAnimationFrame` and `will-change: transform`.

## Accessibility

- **Prefers-reduced-motion**: Supported across all animations.
  - Spinner: Slowed down.
  - Intro: Durations set to 0.1ms.
  - Parallax: Disabled.

## Reusable Classes

The following classes are available in `app.css`:
- `.animate-intro-zoom`
- `.animate-intro-fade`
- `.animate-intro-slide-up`
