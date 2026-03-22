import { describe, expect, it, vi, beforeAll } from 'vitest';
import { mount } from '@vue/test-utils';
import StaggeredReveal from '../StaggeredReveal.vue';

// Mock IntersectionObserver
beforeAll(() => {
  global.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(el) {
      this.callback([{ isIntersecting: true, target: el }]);
    }
    unobserve() {}
    disconnect() {}
  };
});

describe('StaggeredReveal', () => {
  it('renders children with staggered delays', async () => {
    const wrapper = mount(StaggeredReveal, {
      props: { delay: 100 },
      slots: {
        default: '<div class="item">Item 1</div><div class="item">Item 2</div>'
      }
    });

    const items = wrapper.findAll('.item');
    expect(items.length).toBe(2);
    
    // Check transition-delay on children
    expect(items[0].element.style.transitionDelay).toBe('0ms');
    expect(items[1].element.style.transitionDelay).toBe('100ms');
  });

  it('sets is-visible class and updates opacity', async () => {
    const wrapper = mount(StaggeredReveal, {
      slots: {
        default: '<div class="item">Item 1</div>'
      }
    });

    await wrapper.vm.$nextTick();

    // IntersectionObserver mock will trigger reveal immediately
    expect(wrapper.classes()).toContain('is-visible');
    const item = wrapper.find('.item');
    expect(item.element.style.opacity).toBe('1');
  });

  it('applies the correct animation type class', () => {
    const wrapper = mount(StaggeredReveal, {
      props: { animationType: 'scale' }
    });
    expect(wrapper.classes()).toContain('scale');
  });
});
