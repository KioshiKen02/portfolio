import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ParticleLoader from '../ParticleLoader.vue';

describe('ParticleLoader', () => {
  it('renders with default particle count', () => {
    const wrapper = mount(ParticleLoader);
    expect(wrapper.findAll('.particle').length).toBe(12);
    expect(wrapper.text()).toContain('Loading Experience');
  });

  it('renders with custom particle count', () => {
    const wrapper = mount(ParticleLoader, {
      props: { particleCount: 24 }
    });
    expect(wrapper.findAll('.particle').length).toBe(24);
  });

  it('renders custom label', () => {
    const wrapper = mount(ParticleLoader, {
      props: { label: 'Hold tight' }
    });
    expect(wrapper.text()).toContain('Hold tight');
  });

  it('hides label when showLabel is false', () => {
    const wrapper = mount(ParticleLoader, {
      props: { showLabel: false }
    });
    expect(wrapper.find('.particle-label').exists()).toBe(false);
  });
});
