import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import PhotoLightbox from '../PhotoLightbox.vue';

describe('PhotoLightbox', () => {
  it('emits update:index on next button click', async () => {
    const wrapper = mount(PhotoLightbox, {
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
});

