import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import RotatingTypewriter from '../RotatingTypewriter.vue';

describe('RotatingTypewriter', () => {
  it('renders first phrase statically when disabled', () => {
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Hello'], disabled: true },
    });
    expect(wrapper.text()).toContain('Hello');
  });

  it('renders a cursor and measure layer when enabled', () => {
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Hello world.'] },
    });
    expect(wrapper.find('.rtw-cursor').exists()).toBe(true);
    expect(wrapper.find('.rtw-measure').exists()).toBe(true);
  });

  it('does not force explicit line breaks', () => {
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Building scalable digital systems.'], disabled: true },
    });
    expect(wrapper.html()).not.toContain('<br');
  });

  it('updates container height based on measured height', async () => {
    const measureHeightFn = ({ text }) => (String(text).length > 12 ? 96 : 48);
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Short'], disabled: true, minHeightEm: 0, measureHeightFn },
    });

    await wrapper.vm.$nextTick();
    const root = wrapper.find('.rtw-root').element;
    expect(root.getAttribute('style') || '').toContain('height: 48px');

    await wrapper.setProps({ phrases: ['A very long phrase here'], disabled: true });
    await wrapper.vm.$nextTick();
    await Promise.resolve();
    expect(root.getAttribute('style') || '').toContain('height: 96px');
  });
});
