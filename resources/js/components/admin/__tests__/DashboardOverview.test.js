import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import DashboardOverview from '../DashboardOverview.vue';
import { createRouter, createWebHistory } from 'vue-router';

// Mock Lucide icons
vi.mock('lucide-vue-next', () => ({
  TrendingUp: { template: '<div></div>' },
  Users: { template: '<div></div>' },
  Activity: { template: '<div></div>' },
  Calendar: { template: '<div></div>' },
  Clock: { template: '<div></div>' },
  ArrowUpRight: { template: '<div></div>' },
  ArrowDownRight: { template: '<div></div>' },
  MoreHorizontal: { template: '<div></div>' },
  FolderKanban: { template: '<div></div>' },
  Wrench: { template: '<div></div>' },
  Mail: { template: '<div></div>' },
  Zap: { template: '<div></div>' }
}));

// Mock Chart.js
vi.mock('vue-chartjs', () => ({
  Line: { template: '<div class="mock-chart"></div>' }
}));

describe('DashboardOverview', () => {
  const stats = {
    projects: 10,
    skills: 20,
    contacts: 5,
    timeline: 8
  };

  it('renders all stat cards with correct values', () => {
    const wrapper = mount(DashboardOverview, {
      props: { stats }
    });

    expect(wrapper.text()).toContain('10');
    expect(wrapper.text()).toContain('20');
    expect(wrapper.text()).toContain('5');
    expect(wrapper.text()).toContain('8');
    expect(wrapper.text()).toContain('Projects');
    expect(wrapper.text()).toContain('Skills');
  });

  it('renders the engagement chart', () => {
    const wrapper = mount(DashboardOverview, {
      props: { stats }
    });
    expect(wrapper.find('.mock-chart').exists()).toBe(true);
  });

  it('emits changeTab event when quick actions are clicked', async () => {
    const wrapper = mount(DashboardOverview, {
      props: { stats }
    });
    
    const buttons = wrapper.findAll('button');
    const projectButton = buttons.find(b => b.text().includes('New Project'));
    
    if (projectButton) {
      await projectButton.trigger('click');
      expect(wrapper.emitted('changeTab')).toBeTruthy();
      expect(wrapper.emitted('changeTab')?.[0]).toEqual(['projects']);
    }
  });
});
