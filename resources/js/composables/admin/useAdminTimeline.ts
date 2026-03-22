import { ref, computed } from 'vue';
import api from '@/plugins/axios';

export interface TimelineEntry {
  id: number;
  title: string;
  organization: string;
  location?: string;
  starts_at: string;
  ends_at?: string;
  description: string;
  responsibilities: string[];
  type: 'work' | 'education' | 'other';
  sort_order: number;
}

export function useAdminTimeline(onSuccess?: () => void) {
  const timeline = ref<TimelineEntry[]>([]);
  const loading = ref(false);
  const entryModalOpen = ref(false);
  const selectedEntry = ref<Partial<TimelineEntry> | null>(null);
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchTimeline = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/timeline');
      timeline.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch timeline:', err);
      timeline.value = [];
    } finally {
      loading.value = false;
    }
  };

  const openEntryModal = (entry: TimelineEntry | null = null) => {
    selectedEntry.value = entry ? { ...entry } : {
      title: '',
      organization: '',
      type: 'work',
      starts_at: new Date().toISOString().split('T')[0],
      responsibilities: [],
      sort_order: 0,
    };
    entryModalOpen.value = true;
  };

  const closeEntryModal = () => {
    entryModalOpen.value = false;
    selectedEntry.value = null;
    submitState.value = 'idle';
  };

  const handleEntrySubmit = async () => {
    if (!selectedEntry.value) return;
    submitState.value = 'submitting';
    try {
      if (selectedEntry.value.id) {
        await api.put(`/api/admin/timeline/${selectedEntry.value.id}`, selectedEntry.value);
      } else {
        await api.post('/api/admin/timeline', selectedEntry.value);
      }
      await fetchTimeline();
      submitState.value = 'success';
      setTimeout(closeEntryModal, 1500);
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  const deleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this timeline entry?')) return;
    try {
      await api.delete(`/api/admin/timeline/${id}`);
      await fetchTimeline();
      onSuccess?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return {
    timeline,
    loading,
    entryModalOpen,
    selectedEntry,
    submitState,
    fetchTimeline,
    openEntryModal,
    closeEntryModal,
    handleEntrySubmit,
    deleteEntry,
  };
}
