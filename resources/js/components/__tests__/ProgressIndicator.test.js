import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ProgressIndicator from '../ProgressIndicator.vue';

describe('ProgressIndicator', () => {
  it('renders linear progress correctly', () => {
    const wrapper = mount(ProgressIndicator, {
      props: { progress: 50, mode: 'linear' }
    });
    expect(wrapper.classes()).toContain('mode-linear');
    expect(wrapper.find('.linear-fill').attributes('style')).toContain('width: 50%');
    expect(wrapper.text()).toContain('50%');
  });

  it('renders circular progress correctly', () => {
    const wrapper = mount(ProgressIndicator, {
      props: { progress: 75, mode: 'circular' }
    });
    expect(wrapper.classes()).toContain('mode-circular');
    expect(wrapper.find('.circular-fill').attributes('style')).toContain('stroke-dashoffset');
    expect(wrapper.text()).toContain('75%');
  });

  it('handles indeterminate state', () => {
    const wrapper = mount(ProgressIndicator, {
      props: { indeterminate: true, mode: 'linear' }
    });
    expect(wrapper.find('.indeterminate-pulse').exists()).toBe(true);
    expect(wrapper.text()).toContain('Loading...');
  });

  it('hides label when showLabel is false', () => {
    const wrapper = mount(ProgressIndicator, {
      props: { showLabel: false }
    });
    expect(wrapper.text()).not.toContain('%');
  });
});
