import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PhotoLightbox from '../PhotoLightbox.vue';

describe('PhotoLightbox', () => {
  it('emits update:index on next button click', async () => {
    const wrapper = mount(PhotoLightbox, {
      global: { stubs: { teleport: true } },
      props: {
        open: true,
        images: ['1.webp', '2.webp'],
        index: 0,
        title: 'Demo',
      },
    });

    await wrapper.find('button[aria-label="Next"]').trigger('click');
    expect(wrapper.emitted('update:index')?.[0]?.[0]).toBe(1);
  });

  it('emits close on close button click', async () => {
    const wrapper = mount(PhotoLightbox, {
      global: { stubs: { teleport: true } },
      props: {
        open: true,
        images: ['1.webp'],
        index: 0,
        title: 'Demo',
      },
    });

    await wrapper.find('button[aria-label="Close"]').trigger('click');
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  it('renders the close button with fixed positioning', () => {
    const wrapper = mount(PhotoLightbox, {
      global: { stubs: { teleport: true } },
      props: {
        open: true,
        images: ['1.webp'],
        index: 0,
        title: 'Demo',
      },
    });

    const btn = wrapper.find('button[aria-label="Close"]');
    expect(btn.exists()).toBe(true);
    expect(btn.attributes('class')).toContain('fixed');
    expect(btn.attributes('class')).toContain('z-[10000]');
  });

  it('renders the close button on desktop and mobile viewports', async () => {
    const widths = [1920, 375];
    for (const w of widths) {
      Object.defineProperty(window, 'innerWidth', { value: w, configurable: true });
      window.dispatchEvent(new Event('resize'));
      const wrapper = mount(PhotoLightbox, {
        global: { stubs: { teleport: true } },
        props: { open: true, images: ['1.webp'], index: 0, title: 'Demo' },
      });
      expect(wrapper.find('button[aria-label="Close"]').exists()).toBe(true);
      wrapper.unmount();
    }
  });
});
