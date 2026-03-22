<script setup lang="ts">
import { 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Award,
  ExternalLink,
  Calendar,
  Building2,
  MoreVertical,
  Image as ImageIcon
} from 'lucide-vue-next';
import { useAdminCertificates, type Certificate } from '@/composables/admin/useAdminCertificates';
import { onMounted } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
  certificates,
  loading,
  certModalOpen,
  selectedCert,
  submitState,
  fetchCertificates,
  openCertModal,
  closeCertModal,
  handleCertSubmit,
  deleteCert
} = useAdminCertificates(props.onSuccess);

onMounted(fetchCertificates);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Action Bar -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
        <Award class="h-5 w-5 text-indigo-600" />
        Certificates & Seminars
      </h3>
      <button 
        @click="openCertModal()"
        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus class="h-5 w-5" />
        <span>Add Credential</span>
      </button>
    </div>

    <!-- Certificate Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div v-if="loading" v-for="i in 6" :key="i" class="h-64 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse"></div>
      
      <div v-else v-for="cert in certificates" :key="cert.id" class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <!-- Thumbnail -->
        <div class="relative h-40 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
          <img v-if="cert.photo" :src="cert.photo" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
          <Award v-else class="h-16 w-16 text-slate-300 dark:text-slate-700" />
          
          <div class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openCertModal(cert)" class="p-2 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-indigo-600 rounded-xl shadow-lg transition-all">
              <Pencil class="h-4 w-4" />
            </button>
            <button @click="deleteCert(cert.id)" class="p-2 bg-white/90 dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-rose-600 rounded-xl shadow-lg transition-all">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>

          <div class="absolute bottom-4 left-4">
            <span :class="`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-lg ${cert.type === 'certification' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'}`">
              {{ cert.type }}
            </span>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6">
          <h4 class="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{{ cert.title }}</h4>
          
          <div class="mt-4 space-y-2">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Building2 class="h-3.5 w-3.5" />
              {{ cert.issuer }}
            </div>
            <div class="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
              <Calendar class="h-3.5 w-3.5" />
              {{ cert.issued_at }}
            </div>
          </div>

          <div v-if="cert.url" class="mt-6">
            <a :href="cert.url" target="_blank" class="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline">
              Verify Credential
              <ExternalLink class="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>

      <div v-if="!loading && certificates.length === 0" class="col-span-full py-20 text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl">
        <p class="text-slate-500 font-medium">No professional credentials found.</p>
      </div>
    </div>

    <!-- Cert Modal -->
    <transition name="modal">
      <div v-if="certModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div @click="closeCertModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"></div>
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ selectedCert?.id ? 'Refine Credential' : 'New Credential' }}
            </h3>
            <button @click="closeCertModal" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="p-10 space-y-6">
            <div class="grid gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Credential Title</label>
                <input v-model="selectedCert!.title" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. AWS Certified Developer" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Issuing Organization</label>
                <input v-model="selectedCert!.issuer" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Amazon Web Services" />
              </div>
            </div>

            <div class="grid gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Credential Type</label>
                <select v-model="selectedCert!.type" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                  <option value="certification">Professional Certification</option>
                  <option value="seminar">Seminar / Workshop</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Issue Date</label>
                <input v-model="selectedCert!.issued_at" type="date" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Verification URL (Optional)</label>
              <input v-model="selectedCert!.url" type="url" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://..." />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Certificate Image / Photo</label>
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-700">
                  <img v-if="selectedCert!.photo" :src="selectedCert!.photo" class="w-full h-full object-cover rounded-2xl" />
                  <ImageIcon v-else class="h-6 w-6 text-slate-300" />
                </div>
                <input v-model="selectedCert!.photo" type="text" class="flex-1 px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Enter image URL or upload..." />
              </div>
            </div>
          </div>

          <div class="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-4">
            <button @click="closeCertModal" class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
            <button 
              @click="handleCertSubmit"
              :disabled="submitState === 'submitting'"
              class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 disabled:opacity-70"
            >
              {{ submitState === 'submitting' ? 'Processing...' : (selectedCert?.id ? 'Save Changes' : 'Issue Credential') }}
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
</style>
