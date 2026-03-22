import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SkillManager from '../SkillManager.vue';
import { useAdminSkills } from '@/composables/admin/useAdminSkills';

// Mock the composable
vi.mock('@/composables/admin/useAdminSkills', () => ({
  useAdminSkills: vi.fn()
}));

describe('SkillManager', () => {
  const mockSkills = [
    { id: 1, name: 'Vue.js', category: 'frontend', proficiency: 90, sort_order: 1 },
    { id: 2, name: 'Laravel', category: 'backend', proficiency: 85, sort_order: 2 }
  ];

  const mockUseAdminSkills = {
    loading: false,
    searchQuery: '',
    filteredSkills: mockSkills,
    skillModalOpen: false,
    selectedSkill: null,
    submitState: 'idle',
    fetchSkills: vi.fn(),
    openSkillModal: vi.fn(),
    closeSkillModal: vi.fn(),
    handleSkillSubmit: vi.fn(),
    deleteSkill: vi.fn()
  };

  beforeEach(() => {
    vi.mocked(useAdminSkills).mockReturnValue(mockUseAdminSkills as any);
  });

  it('renders skill cards correctly', () => {
    const wrapper = mount(SkillManager);
    expect(wrapper.text()).toContain('Vue.js');
    expect(wrapper.text()).toContain('Laravel');
    expect(wrapper.text()).toContain('FRONTEND');
    expect(wrapper.text()).toContain('BACKEND');
  });

  it('calls openSkillModal when add button is clicked', async () => {
    const wrapper = mount(SkillManager);
    const addButton = wrapper.find('button:has(span:contains("Add Skill"))');
    // Alternatively, find by the span text since we know it's there
    const spans = wrapper.findAll('span');
    const addSpan = spans.find(s => s.text() === 'Add Skill');
    await addSpan?.element.parentElement?.click();
    
    expect(mockUseAdminSkills.openSkillModal).toHaveBeenCalled();
  });

  it('shows empty state when no skills found', () => {
    vi.mocked(useAdminSkills).mockReturnValue({
      ...mockUseAdminSkills,
      filteredSkills: []
    } as any);
    
    const wrapper = mount(SkillManager);
    expect(wrapper.text()).toContain('No skills found matching your search');
  });
});
