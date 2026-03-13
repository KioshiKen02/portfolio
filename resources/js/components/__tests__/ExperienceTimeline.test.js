import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ExperienceTimeline from '../ExperienceTimeline.vue';

describe('ExperienceTimeline', () => {
  it('renders items and toggles details', async () => {
    vi.useFakeTimers();
    const items = [
      { id: 'a', title: 'Role A', company: 'Co A', range: '2024', bullets: ['One', 'Two'] },
      { id: 'b', title: 'Role B', company: 'Co B', range: '2023', bullets: ['X'] },
    ];

    const wrapper = mount(ExperienceTimeline, {
      props: { title: 'Timeline', items },
      global: { stubs: { Transition: false } },
    });

    expect(wrapper.text()).toContain('Role A');
    expect(wrapper.text()).toContain('Role B');

    const buttons = wrapper.findAll('button');
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    expect(wrapper.text()).toContain('One');

    await buttons[0].trigger('click');
    await wrapper.vm.$nextTick();
    vi.runAllTimers();
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).not.toContain('One');

    await buttons[0].trigger('click');
    await wrapper.vm.$nextTick();
    expect(wrapper.text()).toContain('One');
    vi.useRealTimers();
  });
});
