import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import AnimatedCodeBlock from '../AnimatedCodeBlock.vue';

describe('AnimatedCodeBlock', () => {
  it('renders provided lines', () => {
    const wrapper = mount(AnimatedCodeBlock, {
      props: { lines: ['a', 'b'] },
    });
    expect(wrapper.text()).toContain('a');
    expect(wrapper.text()).toContain('b');
  });

  it('renders without animation when disabled', () => {
    const wrapper = mount(AnimatedCodeBlock, {
      props: { lines: ['a'], disabled: true },
    });
    expect(wrapper.find('.acb-line').exists()).toBe(false);
  });

  it('respects prefers-reduced-motion and disables animation', () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} });
    const wrapper = mount(AnimatedCodeBlock, {
      props: { lines: ['a'] },
    });
    expect(wrapper.find('.acb-line').exists()).toBe(false);
    window.matchMedia = original;
  });
});

