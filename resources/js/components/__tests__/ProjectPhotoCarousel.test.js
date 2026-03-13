import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ProjectPhotoCarousel from '../ProjectPhotoCarousel.vue';

describe('ProjectPhotoCarousel', () => {
  it('renders count indicator and allows dot navigation', async () => {
    const images = ['a.webp', 'b.webp', 'c.webp'];
    const wrapper = mount(ProjectPhotoCarousel, {
      props: { images, title: 'Demo' },
    });

    expect(wrapper.text()).toContain('1 of 3');

    const img = wrapper.find('img');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe(images[0]);

    await wrapper.find('button[aria-label="Go to photo 2"]').trigger('click');
    expect(wrapper.find('img').attributes('src')).toBe(images[1]);
    expect(wrapper.text()).toContain('2 of 3');
  });

  it('auto-advances slides when autoplay is enabled', async () => {
    vi.useFakeTimers();
    const images = ['a.webp', 'b.webp'];
    const wrapper = mount(ProjectPhotoCarousel, {
      props: { images, title: 'Demo', autoplayMs: 10 },
    });

    expect(wrapper.find('img').attributes('src')).toBe(images[0]);
    await vi.advanceTimersByTimeAsync(15);
    expect(wrapper.find('img').attributes('src')).toBe(images[1]);
    vi.useRealTimers();
  });
});
