# HomeView Animations

## Typewriter Title
HomeView uses a typewriter animation for the hero title via [TypewriterText.vue](file:///c:/laragon/www/portfolio/resources/js/components/TypewriterText.vue).

### Props
- `text` (string): content to display.
- `typingSpeedMs` (number): delay between characters.
- `pauseBeforeFadeMs` (number): wait time after typing finishes before fading out.
- `fadeDurationMs` (number): opacity transition duration for the fade-out.
- `loop` (boolean): whether the animation repeats.
- `disabled` (boolean): forces static rendering.

### Accessibility and Motion
- If `prefers-reduced-motion: reduce` is enabled, the component renders static text (no animation).
- When animation is enabled, the animated span is `aria-hidden` and a screen-reader-only static version is provided.

## Hero Entrance
HomeView adds a lightweight page-load entrance transition to the hero text block using an `opacity/translate` transition.

