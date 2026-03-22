import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import SkeletonLoader from '../SkeletonLoader.vue';

describe('SkeletonLoader', () => {
  it('renders with default props', () => {
    const wrapper = mount(SkeletonLoader);
    expect(wrapper.classes()).toContain('skeleton-text');
    expect(wrapper.classes()).toContain('skeleton-shimmer');
  });

  it('renders correctly for different types', () => {
    const types = ['rect', 'circle', 'card'];
    types.forEach(type => {
      const wrapper = mount(SkeletonLoader, { props: { type } });
      expect(wrapper.classes()).toContain(`skeleton-${type}`);
    });
  });

  it('applies custom dimensions', () => {
    const wrapper = mount(SkeletonLoader, {
      props: { width: '200px', height: '50px' }
    });
    const style = wrapper.attributes('style');
    expect(style).toContain('width: 200px');
    expect(style).toContain('height: 50px');
  });

  it('handles pulse animation', () => {
    const wrapper = mount(SkeletonLoader, { props: { animation: 'pulse' } });
    expect(wrapper.classes()).toContain('skeleton-pulse');
  });
});
