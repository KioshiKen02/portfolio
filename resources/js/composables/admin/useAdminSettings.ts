import { ref, reactive, computed } from 'vue';
import api from '@/plugins/axios';

export interface SiteSettings {
  site_title: string;
  site_description: string;
  site_author: string;
  site_logo?: string;
  hero_badge_text?: string;
  hero_description?: string;
  about_heading?: string;
  about_paragraph_1?: string;
  about_paragraph_2?: string;
  resume_url?: string;
  contact_email?: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  profile_picture_light_default?: string;
  profile_picture_light_hover?: string;
  profile_picture_dark_default?: string;
  profile_picture_dark_hover?: string;
}

export function useAdminSettings(onSuccess?: () => void) {
  const settings = ref<Partial<SiteSettings>>({});
  const loading = ref(false);
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchSettings = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/settings');
      settings.value = data;
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      loading.value = false;
    }
  };

  const handleSettingsSubmit = async () => {
    submitState.value = 'submitting';
    try {
      await api.put('/api/admin/settings', settings.value);
      submitState.value = 'success';
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  return {
    settings,
    loading,
    submitState,
    fetchSettings,
    handleSettingsSubmit,
  };
}
