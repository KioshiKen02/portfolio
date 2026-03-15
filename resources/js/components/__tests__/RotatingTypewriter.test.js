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

  it('splits a long phrase into exactly two lines', () => {
    const measureTextFn = (s) => String(s).length * 10;
    const wrapper = mount(RotatingTypewriter, {
      props: {
        phrases: ['Building scalable digital systems.'],
        disabled: true,
        reserveSpace: true,
        testWidthPx: 180,
        baseFontSizePx: 20,
        measureTextFn,
      },
    });

    const line1 = wrapper.find('.rtw-live .rtw-line1').text().trim();
    const line2 = wrapper.find('.rtw-live .rtw-line2').text().trim();
    expect(line1.length).toBeGreaterThan(0);
    expect(line2.length).toBeGreaterThan(0);
    expect(wrapper.html()).toContain('<br');
  });
});
