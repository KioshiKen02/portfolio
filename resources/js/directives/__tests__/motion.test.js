import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { motionDirective } from '../motion';

const TestCmp = {
  template: `<div id="box" v-motion="binding">Box</div>`,
  props: ['binding'],
};

describe('motionDirective', () => {
  it('reveals only after entering viewport and unobserves once', async () => {
    const unobserve = vi.fn();
    const observe = vi.fn();
    let cb;

    const OriginalIO = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(_cb) {
        cb = _cb;
      }
      observe(el) {
        observe(el);
      }
      unobserve(el) {
        unobserve(el);
      }
      disconnect() {}
    };

    const wrapper = mount(TestCmp, {
      props: { binding: { reveal: { delayMs: 0, durationMs: 10 } } },
      global: { directives: { motion: motionDirective } },
    });

    const el = wrapper.find('#box').element;
    expect(el.style.opacity).toBe('0');
    expect(el.style.transform).toContain('translate3d');

    cb([{ isIntersecting: true, target: el }]);
    await Promise.resolve();

    expect(el.style.opacity).toBe('1');
    expect(unobserve).toHaveBeenCalled();

    globalThis.IntersectionObserver = OriginalIO;
  });

  it('parallax updates via requestAnimationFrame and does not schedule twice per scroll burst', async () => {
    const OriginalRAF = window.requestAnimationFrame;
    const OriginalIO = globalThis.IntersectionObserver;
    const OriginalRect = Element.prototype.getBoundingClientRect;

    globalThis.IntersectionObserver = class {
      constructor(cb) {
        cb([{ isIntersecting: true }]);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    Element.prototype.getBoundingClientRect = () => ({ top: 200, height: 100, left: 0, width: 100, bottom: 300, right: 100 });
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true });

    let rafCb = null;
    const rafCalls = vi.fn();
    window.requestAnimationFrame = (cb) => {
      rafCalls();
      rafCb = cb;
      return 1;
    };

    const wrapper = mount(TestCmp, {
      props: { binding: { reveal: false, parallax: { speed: 0.1, max: 30 } } },
      global: { directives: { motion: motionDirective } },
    });

    window.dispatchEvent(new Event('scroll'));
    window.dispatchEvent(new Event('scroll'));
    expect(rafCalls).toHaveBeenCalledTimes(1);

    rafCb && rafCb();
    const el = wrapper.find('#box').element;
    expect(el.style.transform).toContain('translate3d');

    window.requestAnimationFrame = OriginalRAF;
    globalThis.IntersectionObserver = OriginalIO;
    Element.prototype.getBoundingClientRect = OriginalRect;
  });
});

