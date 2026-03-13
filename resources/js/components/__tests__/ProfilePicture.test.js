import { describe, expect, it } from 'vitest';
import { mount } from '@vue/test-utils';
import ProfilePicture from '../ProfilePicture.vue';

describe('ProfilePicture', () => {
  it('renders light default and hover sources', async () => {
    const wrapper = mount(ProfilePicture, {
      props: {
        isDark: false,
        lightDefaultSrc: 'light-default.png',
        lightHoverSrc: 'light-hover.png',
        darkDefaultSrc: 'dark-default.png',
        darkHoverSrc: 'dark-hover.png',
        fallbackSrc: 'fallback.svg',
      },
    });

    const imgs = wrapper.findAll('img');
    expect(imgs).toHaveLength(2);
    expect(imgs[0].attributes('src')).toBe('light-default.png');
    expect(imgs[1].attributes('src')).toBe('light-hover.png');

    await wrapper.trigger('mouseenter');
    expect(imgs[0].classes()).toContain('opacity-0');
    expect(imgs[1].classes()).toContain('opacity-100');
  });

  it('switches to dark sources when theme changes', async () => {
    const wrapper = mount(ProfilePicture, {
      props: {
        isDark: false,
        lightDefaultSrc: 'light-default.png',
        lightHoverSrc: 'light-hover.png',
        darkDefaultSrc: 'dark-default.png',
        darkHoverSrc: 'dark-hover.png',
        fallbackSrc: 'fallback.svg',
      },
    });

    expect(wrapper.findAll('img')[0].attributes('src')).toBe('light-default.png');

    await wrapper.setProps({ isDark: true });
    expect(wrapper.findAll('img')[0].attributes('src')).toBe('dark-default.png');
    expect(wrapper.findAll('img')[1].attributes('src')).toBe('dark-hover.png');
  });

  it('falls back on image load error', async () => {
    const wrapper = mount(ProfilePicture, {
      props: {
        isDark: false,
        lightDefaultSrc: 'broken.png',
        lightHoverSrc: 'hover.png',
        darkDefaultSrc: 'dark.png',
        darkHoverSrc: 'dark-hover.png',
        fallbackSrc: 'fallback.svg',
      },
    });

    const imgs = wrapper.findAll('img');
    await imgs[0].trigger('error');
    expect(imgs[0].attributes('src')).toBe('fallback.svg');
  });
});

