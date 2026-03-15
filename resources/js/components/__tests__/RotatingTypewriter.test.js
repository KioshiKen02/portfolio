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

  it('renders a cursor and reserve layer when enabled', () => {
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Hello world.'], reserveSpace: true },
    });
    expect(wrapper.find('.rtw-cursor').exists()).toBe(true);
    expect(wrapper.find('.rtw-reserve').exists()).toBe(true);
  });

  it('does not force explicit line breaks', () => {
    const wrapper = mount(RotatingTypewriter, {
      props: { phrases: ['Building scalable digital systems.'], disabled: true, reserveSpace: true },
    });
    expect(wrapper.html()).not.toContain('<br');
  });
});
