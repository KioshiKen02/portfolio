import { ref, computed } from 'vue';
import api from '@/plugins/axios';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  is_read: boolean;
}

export function useAdminContacts(onSuccess?: () => void) {
  const contacts = ref<ContactMessage[]>([]);
  const loading = ref(false);
  const selectedContact = ref<ContactMessage | null>(null);
  const replyModalOpen = ref(false);
  const replyForm = ref({
    subject: '',
    message: '',
  });
  const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const fetchContacts = async () => {
    loading.value = true;
    try {
      const { data } = await api.get('/api/admin/contacts');
      const list = Array.isArray(data) ? data : [];
      contacts.value = list.map((c: any) => ({
        ...c,
        is_read: c.status !== 'new'
      }));
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
      contacts.value = [];
    } finally {
      loading.value = false;
    }
  };

  const markAsRead = async (id: number) => {
    try {
      // The show endpoint handles marking as read automatically if status is 'new'
      await api.get(`/api/admin/contacts/${id}`);
      const contact = contacts.value.find(c => c.id === id);
      if (contact) contact.is_read = true;
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const openReplyModal = (contact: ContactMessage) => {
    selectedContact.value = contact;
    replyForm.value = {
      subject: `Re: ${contact.subject}`,
      message: '',
    };
    replyModalOpen.value = true;
    if (!contact.is_read) markAsRead(contact.id);
  };

  const closeReplyModal = () => {
    replyModalOpen.value = false;
    selectedContact.value = null;
    submitState.value = 'idle';
  };

  const handleReplySubmit = async () => {
    if (!selectedContact.value) return;
    submitState.value = 'submitting';
    try {
      await api.post(`/api/admin/contacts/${selectedContact.value.id}/reply`, {
        reply_message: replyForm.value.message,
        subject: replyForm.value.subject // Optional but good for consistency
      });
      submitState.value = 'success';
      setTimeout(closeReplyModal, 1500);
      onSuccess?.();
    } catch (err) {
      submitState.value = 'error';
    }
  };

  const deleteContact = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await api.delete(`/api/admin/contacts/${id}`);
      await fetchContacts();
      onSuccess?.();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return {
    contacts,
    loading,
    selectedContact,
    replyModalOpen,
    replyForm,
    submitState,
    fetchContacts,
    openReplyModal,
    closeReplyModal,
    handleReplySubmit,
    deleteContact,
    markAsRead,
  };
}
