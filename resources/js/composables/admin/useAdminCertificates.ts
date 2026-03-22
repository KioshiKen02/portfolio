import { ref, computed } from 'vue';
import api from '@/plugins/axios';

export interface Certificate {
  id: number;
  title: string;
  issuer: string;
  issued_at: string;
  expires_at?: string;
  credential_id?: string;
  url?: string;
  photo?: string;
  type: 'certification' | 'seminar';
  sort_order: number;
}

export function useAdminCertificates(onSuccess?: () => void) {
  const certificates = ref<Certificate[]>([]);
  const loading = ref(false);
  const certModalOpen = ref(false);
  const selectedCert = ref<Partial<Certificate> | null>(null);
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchCertificates = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/certificates');
      certificates.value = Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch certificates:', err);
      certificates.value = [];
    } finally {
      loading.value = false;
    }
  };

  const openCertModal = (cert: Certificate | null = null) => {
    selectedCert.value = cert ? { ...cert } : {
      title: '',
      issuer: '',
      type: 'certification',
      issued_at: new Date().toISOString().split('T')[0],
      sort_order: 0,
    };
    certModalOpen.value = true;
  };

  const closeCertModal = () => {
    certModalOpen.value = false;
    selectedCert.value = null;
    submitState.value = 'idle';
  };

  const handleCertSubmit = async () => {
    if (!selectedCert.value) return;
    submitState.value = 'submitting';
    try {
      if (selectedCert.value.id) {
        await api.put(`/api/admin/certificates/${selectedCert.value.id}`, selectedCert.value);
      } else {
        await api.post('/api/admin/certificates', selectedCert.value);
      }
      await fetchCertificates();
      submitState.value = 'success';
      setTimeout(closeCertModal, 1500);
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  const deleteCert = async (id: number) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;
    try {
      await api.delete(`/api/admin/certificates/${id}`);
      await fetchCertificates();
      onSuccess?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return {
    certificates,
    loading,
    certModalOpen,
    selectedCert,
    submitState,
    fetchCertificates,
    openCertModal,
    closeCertModal,
    handleCertSubmit,
    deleteCert,
  };
}
