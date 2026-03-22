<script setup lang="ts">
import { 
  Mail, 
  Trash2, 
  X,
  MessageSquare,
  User,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle
} from 'lucide-vue-next';
import { useAdminContacts, type ContactMessage } from '@/composables/admin/useAdminContacts';
import { onMounted } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
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
  deleteContact
} = useAdminContacts(props.onSuccess);

onMounted(fetchContacts);

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Action Bar -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Mail class="h-5 w-5 text-indigo-600" />
        Inbound Messages
      </h3>
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider">
          {{ (contacts || []).filter(c => !c.is_read).length }} New
        </span>
      </div>
    </div>

    <!-- Message List -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Sender</th>
              <th class="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Subject / Message</th>
              <th class="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400">Received</th>
              <th class="px-8 py-5 text-xs font-black uppercase tracking-[0.2em] text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td colspan="4" class="px-8 py-6"><div class="h-12 w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl"></div></td>
            </tr>
            
            <tr 
              v-else v-for="contact in contacts" 
              :key="contact.id" 
              @click="openReplyModal(contact)"
              class="group cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-all duration-300"
              :class="{ 'bg-indigo-50/30 dark:bg-indigo-900/5': !contact.is_read }"
            >
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div :class="`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black shadow-inner ${contact.is_read ? 'bg-slate-100 text-slate-500 dark:bg-slate-800' : 'bg-indigo-600 text-white shadow-indigo-500/20'}`">
                    {{ contact.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{{ contact.name }}</p>
                    <p class="text-xs font-medium text-slate-500 dark:text-slate-400 truncate max-w-[150px]">{{ contact.email }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="max-w-md">
                  <p class="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span v-if="!contact.is_read" class="h-2 w-2 rounded-full bg-indigo-600 shrink-0"></span>
                    {{ contact.subject }}
                  </p>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1 italic">{{ contact.message }}</p>
                </div>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-col gap-1">
                  <span class="text-xs font-bold text-slate-900 dark:text-white">{{ formatDate(contact.created_at) }}</span>
                  <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">ISO Timestamp</span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button @click.stop="deleteContact(contact.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="!loading && contacts.length === 0">
              <td colspan="4" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                    <MessageSquare class="h-8 w-8" />
                  </div>
                  <p class="text-slate-500 font-medium">Your inbox is currently empty.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Reply Modal -->
    <transition name="modal">
      <div v-if="replyModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div @click="closeReplyModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"></div>
        <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                <MessageSquare class="h-6 w-6" />
              </div>
              <div>
                <h3 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">Conversation Thread</h3>
                <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Encrypted Direct Message</p>
              </div>
            </div>
            <button @click="closeReplyModal" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-10">
            <!-- Original Message -->
            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-black text-slate-500">
                    {{ selectedContact?.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="text-sm font-bold text-slate-900 dark:text-white">{{ selectedContact?.name }}</p>
                    <p class="text-[10px] font-medium text-slate-500">{{ selectedContact?.email }}</p>
                  </div>
                </div>
                <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">{{ formatDate(selectedContact!.created_at) }}</span>
              </div>
              <div class="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-6 border border-slate-100 dark:border-slate-800">
                <h4 class="text-sm font-black text-slate-900 dark:text-white mb-2">{{ selectedContact?.subject }}</h4>
                <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">{{ selectedContact?.message }}</p>
              </div>
            </div>

            <!-- Reply Form -->
            <div class="space-y-6 pt-10 border-t border-slate-100 dark:border-slate-800">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-xs font-black text-indigo-600 dark:text-indigo-400">
                  A
                </div>
                <div>
                  <p class="text-sm font-bold text-slate-900 dark:text-white">Administrator</p>
                  <p class="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">Drafting Response</p>
                </div>
              </div>

              <div class="space-y-4">
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Response Subject</label>
                  <input v-model="replyForm.subject" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div class="space-y-2">
                  <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Message Content</label>
                  <textarea v-model="replyForm.message" rows="6" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Type your professional response here..."></textarea>
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-4 shrink-0">
            <button @click="closeReplyModal" class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Discard Draft</button>
            <button 
              @click="handleReplySubmit"
              :disabled="submitState === 'submitting' || !replyForm.message"
              class="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 disabled:opacity-70 active:translate-y-0.5 transition-all"
            >
              <template v-if="submitState === 'submitting'">
                <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Transmitting...</span>
              </template>
              <template v-else-if="submitState === 'success'">
                <CheckCircle2 class="h-4 w-4" />
                <span>Message Dispatched</span>
              </template>
              <template v-else>
                <Send class="h-4 w-4" />
                <span>Dispatch Response</span>
              </template>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
