import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import CodeTypewriter from '../CodeTypewriter.vue';

describe('CodeTypewriter', () => {
  it('renders full text when disabled', () => {
    const wrapper = mount(CodeTypewriter, {
      props: { text: 'a\nb', disabled: true },
    });
    expect(wrapper.text()).toContain('a');
    expect(wrapper.text()).toContain('b');
  });

  it('types characters over time', async () => {
    vi.useFakeTimers();
    const wrapper = mount(CodeTypewriter, {
      props: { text: 'abc', startDelayMs: 0, minCharDelayMs: 10, maxCharDelayMs: 10, loop: false },
    });

    expect(wrapper.text()).toContain('a');
    await vi.advanceTimersByTimeAsync(10);
    expect(wrapper.text()).toContain('ab');
    await vi.advanceTimersByTimeAsync(10);
    expect(wrapper.text()).toContain('abc');
    vi.useRealTimers();
  });

  it('renders a reserve layer when reserveSpace is enabled', () => {
    const wrapper = mount(CodeTypewriter, {
      props: { text: 'abc', disabled: true, reserveSpace: true },
    });
    expect(wrapper.find('.ctw-reserve').exists()).toBe(true);
  });
});

