import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import AdvancedLoader from '../AdvancedLoader.vue';

describe('AdvancedLoader', () => {
  it('renders correctly in loading state', () => {
    const wrapper = mount(AdvancedLoader, {
      props: { state: 'loading' }
    });
    
    expect(wrapper.classes()).toContain('state-loading');
    expect(wrapper.find('.morphing-svg').exists()).toBe(true);
    expect(wrapper.find('.orbiting-dot').exists()).toBe(true);
    expect(wrapper.text()).toContain('Processing');
    expect(wrapper.attributes('aria-live')).toBe('polite');
  });

  it('renders correctly in success state', () => {
    const wrapper = mount(AdvancedLoader, {
      props: { state: 'success' }
    });
    
    expect(wrapper.classes()).toContain('state-success');
    expect(wrapper.find('.success-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('Complete');
    expect(wrapper.attributes('aria-live')).toBe('assertive');
  });

  it('renders correctly in error state', () => {
    const wrapper = mount(AdvancedLoader, {
      props: { state: 'error' }
    });
    
    expect(wrapper.classes()).toContain('state-error');
    expect(wrapper.find('.error-icon').exists()).toBe(true);
    expect(wrapper.text()).toContain('Failed');
    expect(wrapper.attributes('aria-live')).toBe('assertive');
  });

  it('applies custom labels correctly', () => {
    const customLabels = { loading: 'Fetching data', success: 'All good!' };
    const wrapper = mount(AdvancedLoader, {
      props: { state: 'loading', customLabels }
    });
    
    expect(wrapper.text()).toContain('Fetching data');
    
    const successWrapper = mount(AdvancedLoader, {
      props: { state: 'success', customLabels }
    });
    expect(successWrapper.text()).toContain('All good!');
  });

  it('respects the size prop', () => {
    const wrapper = mount(AdvancedLoader, {
      props: { size: 'lg' }
    });
    expect(wrapper.classes()).toContain('size-lg');
  });

  it('hides label when showLabel is false', () => {
    const wrapper = mount(AdvancedLoader, {
      props: { showLabel: false }
    });
    expect(wrapper.find('.loader-label').exists()).toBe(false);
  });
});
