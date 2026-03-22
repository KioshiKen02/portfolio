import { ref, computed } from 'vue';
import api from '@/plugins/axios';

export interface Skill {
  id: number;
  name: string;
  category: string;
  proficiency: number;
  icon?: string;
  sort_order: number;
}

export function useAdminSkills(onSuccess?: () => void) {
  const skills = ref<Skill[]>([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const skillModalOpen = ref(false);
  const selectedSkill = ref<Partial<Skill> | null>(null);
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const filteredSkills = computed(() => {
    if (!searchQuery.value) return skills.value;
    const query = searchQuery.value.toLowerCase();
    return skills.value.filter(s => 
      s.name.toLowerCase().includes(query) || 
      s.category.toLowerCase().includes(query)
    );
  });

  const fetchSkills = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/skills');
      skills.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch skills:', err);
      skills.value = [];
    } finally {
      loading.value = false;
    }
  };

  const openSkillModal = (skill: Skill | null = null) => {
    selectedSkill.value = skill ? { ...skill } : {
      name: '',
      category: 'frontend',
      proficiency: 80,
      sort_order: 0,
    };
    skillModalOpen.value = true;
  };

  const closeSkillModal = () => {
    skillModalOpen.value = false;
    selectedSkill.value = null;
    submitState.value = 'idle';
  };

  const handleSkillSubmit = async () => {
    if (!selectedSkill.value) return;
    submitState.value = 'submitting';
    try {
      if (selectedSkill.value.id) {
        await api.put(`/api/admin/skills/${selectedSkill.value.id}`, selectedSkill.value);
      } else {
        await api.post('/api/admin/skills', selectedSkill.value);
      }
      await fetchSkills();
      submitState.value = 'success';
      setTimeout(closeSkillModal, 1500);
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return;
    try {
      await api.delete(`/api/admin/skills/${id}`);
      await fetchSkills();
      onSuccess?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return {
    skills,
    loading,
    searchQuery,
    filteredSkills,
    skillModalOpen,
    selectedSkill,
    submitState,
    fetchSkills,
    openSkillModal,
    closeSkillModal,
    handleSkillSubmit,
    deleteSkill,
  };
}
