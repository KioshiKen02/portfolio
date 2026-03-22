import { ref, computed } from 'vue';
import api from '@/plugins/axios';

export interface Project {
  id: number;
  title: string;
  description: string;
  type: string;
  technologies: string[];
  url?: string;
  github_url?: string;
  images: string[];
  sort_order: number;
}

export function useAdminProjects(onSuccess?: () => void) {
  const projects = ref<Project[]>([]);
  const loading = ref(false);
  const searchQuery = ref('');
  const projectModalOpen = ref(false);
  const selectedProject = ref<Partial<Project> | null>(null);
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const filteredProjects = computed(() => {
    if (!searchQuery.value) return projects.value;
    const query = searchQuery.value.toLowerCase();
    return projects.value.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.technologies.some(t => t.toLowerCase().includes(query))
    );
  });

  const fetchProjects = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/projects');
      projects.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch projects:', err);
      projects.value = [];
    } finally {
      loading.value = false;
    }
  };

  const openProjectModal = (project: Project | null = null) => {
    selectedProject.value = project ? { ...project } : {
      title: '',
      description: '',
      type: 'web',
      technologies: [],
      images: [],
      sort_order: 0,
    };
    projectModalOpen.value = true;
  };

  const closeProjectModal = () => {
    projectModalOpen.value = false;
    selectedProject.value = null;
    submitState.value = 'idle';
  };

  const handleProjectSubmit = async () => {
    if (!selectedProject.value) return;
    submitState.value = 'submitting';
    try {
      if (selectedProject.value.id) {
        await api.put(`/api/admin/projects/${selectedProject.value.id}`, selectedProject.value);
      } else {
        await api.post('/api/admin/projects', selectedProject.value);
      }
      await fetchProjects();
      submitState.value = 'success';
      setTimeout(closeProjectModal, 1500);
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/api/admin/projects/${id}`);
      await fetchProjects();
      onSuccess?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return {
    projects,
    loading,
    searchQuery,
    filteredProjects,
    projectModalOpen,
    selectedProject,
    submitState,
    fetchProjects,
    openProjectModal,
    closeProjectModal,
    handleProjectSubmit,
    deleteProject,
  };
}
