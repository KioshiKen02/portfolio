import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import TypingNameLoader from '../TypingNameLoader.vue';

describe('TypingNameLoader', () => {
  it('renders the correct number of characters', () => {
    const text = 'Melvin';
    const wrapper = mount(TypingNameLoader, {
      props: { text }
    });
    const chars = wrapper.findAll('.typing-char');
    expect(chars.length).toBe(6);
  });

  it('applies staggered animation delays', () => {
    const text = 'AB';
    const speed = 50;
    const wrapper = mount(TypingNameLoader, {
      props: { text, speed }
    });
    const chars = wrapper.findAll('.typing-char');
    expect(chars[0].element.style.animationDelay).toBe('0ms');
    expect(chars[1].element.style.animationDelay).toBe('50ms');
  });

  it('renders a blinking cursor', () => {
    const wrapper = mount(TypingNameLoader);
    expect(wrapper.find('.typing-cursor').exists()).toBe(true);
  });

  it('triggers replay when prop changes', async () => {
    const wrapper = mount(TypingNameLoader, {
      props: { replay: false }
    });
    
    // Check initial state
    expect(wrapper.classes()).not.toContain('is-replaying');
    
    // Update replay prop
    await wrapper.setProps({ replay: true });
    expect(wrapper.classes()).toContain('is-replaying');
  });

  it('includes accessibility fallback', () => {
    const text = 'Test Name';
    const wrapper = mount(TypingNameLoader, {
      props: { text }
    });
    expect(wrapper.find('.sr-only').text()).toBe(text);
    expect(wrapper.attributes('aria-label')).toBe(text);
  });
});
