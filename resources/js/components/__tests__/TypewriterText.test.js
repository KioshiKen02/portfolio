import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TypewriterText from '../TypewriterText.vue';

describe('TypewriterText', () => {
  it('renders static text when disabled', () => {
    const wrapper = mount(TypewriterText, {
      props: { text: 'Hello', disabled: true },
    });
    expect(wrapper.text()).toContain('Hello');
  });

  it('types text over time and includes a screen-reader fallback', async () => {
    vi.useFakeTimers();
    const wrapper = mount(TypewriterText, {
      props: { text: 'Hi', typingSpeedMs: 10, pauseBeforeFadeMs: 20, fadeDurationMs: 10, loop: false },
    });

    expect(wrapper.find('.sr-only').exists()).toBe(true);
    expect(wrapper.text()).toContain('Hi');

    await vi.advanceTimersByTimeAsync(12);
    expect(wrapper.text()).toContain('H');
    await vi.advanceTimersByTimeAsync(12);
    expect(wrapper.text()).toContain('Hi');

    vi.useRealTimers();
  });

  it('respects prefers-reduced-motion and renders text without sr-only fallback', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} });

    const wrapper = mount(TypewriterText, {
      props: { text: 'Hello', typingSpeedMs: 10 },
    });

    expect(wrapper.find('.sr-only').exists()).toBe(false);
    expect(wrapper.text()).toContain('Hello');

    window.matchMedia = original;
  });
});

