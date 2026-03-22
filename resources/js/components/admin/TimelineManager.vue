<script setup lang="ts">
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  History,
  Briefcase,
  GraduationCap,
  Calendar,
  MoreVertical
} from 'lucide-vue-next';
import { useAdminTimeline, type TimelineEntry } from '@/composables/admin/useAdminTimeline';
import { onMounted } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
  timeline,
  loading,
  entryModalOpen,
  selectedEntry,
  submitState,
  fetchTimeline,
  openEntryModal,
  closeEntryModal,
  handleEntrySubmit,
  deleteEntry
} = useAdminTimeline(props.onSuccess);

onMounted(fetchTimeline);

const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short'
  });
};

const addResponsibility = () => {
  if (!selectedEntry.value?.responsibilities) selectedEntry.value!.responsibilities = [];
  selectedEntry.value!.responsibilities.push('');
};

const removeResponsibility = (index: number) => {
  selectedEntry.value!.responsibilities!.splice(index, 1);
};
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Action Bar -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <History class="h-5 w-5 text-indigo-600" />
        Experience Timeline
      </h3>
      <button 
        @click="openEntryModal()"
        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus class="h-5 w-5" />
        <span>Add Entry</span>
      </button>
    </div>

    <!-- Timeline List -->
    <div class="space-y-4">
      <div v-if="loading" v-for="i in 3" :key="i" class="h-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse"></div>
      
      <div v-else v-for="entry in timeline" :key="entry.id" class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <div class="flex items-start gap-6">
          <div :class="`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${entry.type === 'work' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'}`">
            <Briefcase v-if="entry.type === 'work'" class="h-7 w-7" />
            <GraduationCap v-else class="h-7 w-7" />
          </div>
          
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div>
                <h4 class="text-xl font-black text-slate-900 dark:text-white tracking-tight">{{ entry.title }}</h4>
                <p class="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1 uppercase tracking-wider">{{ entry.organization }}</p>
              </div>
              <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="openEntryModal(entry)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
                  <Pencil class="h-4 w-4" />
                </button>
                <button @click="deleteEntry(entry.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
                  <Trash2 class="h-4 w-4" />
                </button>
              </div>
            </div>

            <div class="flex items-center gap-4 mt-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <div class="flex items-center gap-1.5">
                <Calendar class="h-3.5 w-3.5" />
                {{ formatDate(entry.starts_at) }} — {{ entry.ends_at ? formatDate(entry.ends_at) : 'Present' }}
              </div>
              <div v-if="entry.location" class="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-700"></div>
              <div v-if="entry.location">{{ entry.location }}</div>
            </div>

            <p class="mt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">{{ entry.description }}</p>
            
            <ul v-if="entry.responsibilities?.length" class="mt-4 space-y-2">
              <li v-for="(resp, idx) in entry.responsibilities" :key="idx" class="flex items-start gap-3 text-xs font-medium text-slate-500 dark:text-slate-400">
                <div class="mt-1.5 h-1.5 w-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                {{ resp }}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div v-if="!loading && timeline.length === 0" class="py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p class="text-slate-500 font-medium">Your professional timeline is currently empty.</p>
      </div>
    </div>

    <!-- Entry Modal -->
    <transition name="modal">
      <div v-if="entryModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div @click="closeEntryModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"></div>
        <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
          <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ selectedEntry?.id ? 'Refine Entry' : 'New Milestone' }}
            </h3>
            <button @click="closeEntryModal" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="p-10 overflow-y-auto custom-scrollbar space-y-8">
            <div class="grid gap-8 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Position / Title</label>
                <input v-model="selectedEntry!.title" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Senior Software Engineer" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Organization</label>
                <input v-model="selectedEntry!.organization" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Tech Corp" />
              </div>
            </div>

            <div class="grid gap-8 sm:grid-cols-3">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Type</label>
                <select v-model="selectedEntry!.type" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                  <option value="work">Professional Work</option>
                  <option value="education">Education</option>
                  <option value="other">Other Activity</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Start Date</label>
                <input v-model="selectedEntry!.starts_at" type="date" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">End Date (Optional)</label>
                <input v-model="selectedEntry!.ends_at" type="date" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Description</label>
              <textarea v-model="selectedEntry!.description" rows="3" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Brief overview of your role and accomplishments..."></textarea>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Key Responsibilities</label>
                <button @click="addResponsibility" class="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">+ Add Point</button>
              </div>
              <div class="space-y-3">
                <div v-for="(_, index) in selectedEntry!.responsibilities" :key="index" class="flex gap-3">
                  <input v-model="selectedEntry!.responsibilities![index]" type="text" class="flex-1 px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-none rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Optimized database queries for 40% faster load times" />
                  <button @click="removeResponsibility(index)" class="p-3 text-slate-400 hover:text-rose-500 transition-colors">
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-4 shrink-0">
            <button @click="closeEntryModal" class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
            <button 
              @click="handleEntrySubmit"
              :disabled="submitState === 'submitting'"
              class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 disabled:opacity-70"
            >
              {{ submitState === 'submitting' ? 'Processing...' : (selectedEntry?.id ? 'Commit Changes' : 'Initialize Milestone') }}
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
