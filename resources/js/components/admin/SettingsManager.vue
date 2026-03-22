<script setup lang="ts">
import { 
  Settings, 
  Save, 
  Globe, 
  User, 
  Link as LinkIcon, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-vue-next';
import { useAdminSettings } from '@/composables/admin/useAdminSettings';
import { onMounted, ref } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
  settings,
  loading,
  submitState,
  fetchSettings,
  handleSettingsSubmit
} = useAdminSettings(props.onSuccess);

const activeSection = ref('general'); // 'general', 'hero', 'about', 'social'

onMounted(fetchSettings);

const sections = [
  { id: 'general', label: 'General Identity', icon: Globe },
  { id: 'hero', label: 'Hero / Introduction', icon: User },
  { id: 'about', label: 'About / Bio', icon: FileText },
  { id: 'social', label: 'Digital Presence', icon: LinkIcon }
];
</script>

<template>
  <div class="space-y-10 animate-fade-in">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
          <Settings class="h-6 w-6" />
        </div>
        <div>
          <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Environment Configuration</h3>
          <p class="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5">Global Site Variables & Personal Branding</p>
        </div>
      </div>
      
      <button 
        @click="handleSettingsSubmit"
        :disabled="submitState === 'submitting'"
        class="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-[2rem] font-black text-sm hover:bg-indigo-700 shadow-2xl shadow-indigo-600/20 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-70"
      >
        <template v-if="submitState === 'submitting'">
          <div class="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Synchronizing...</span>
        </template>
        <template v-else-if="submitState === 'success'">
          <CheckCircle2 class="h-4 w-4" />
          <span>Config Updated</span>
        </template>
        <template v-else>
          <Save class="h-4 w-4" />
          <span>Save Changes</span>
        </template>
      </button>
    </div>

    <div class="flex flex-col lg:flex-row gap-10">
      <!-- Navigation -->
      <aside class="lg:w-72 space-y-2">
        <button 
          v-for="section in sections" 
          :key="section.id"
          @click="activeSection = section.id"
          class="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300"
          :class="activeSection === section.id 
            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 translate-x-2' 
            : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'"
        >
          <component :is="section.icon" class="h-5 w-5" />
          {{ section.label }}
        </button>
      </aside>

      <!-- Content -->
      <div class="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[3rem] p-10 shadow-sm relative overflow-hidden">
        <div v-if="loading" class="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div class="h-10 w-10 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>

        <div v-show="activeSection === 'general'" class="space-y-8 animate-fade-in">
          <h4 class="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Global Identity</h4>
          <div class="grid gap-8 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Site Title</label>
              <input v-model="settings.site_title" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">System Author</label>
              <input v-model="settings.site_author" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meta Description</label>
            <textarea v-model="settings.site_description" rows="3" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>

        <div v-show="activeSection === 'hero'" class="space-y-8 animate-fade-in">
          <h4 class="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Hero Introduction</h4>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Badge Text</label>
            <input v-model="settings.hero_badge_text" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. Available for Hire" />
          </div>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Introduction Paragraph</label>
            <textarea v-model="settings.hero_description" rows="3" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
          </div>
        </div>

        <div v-show="activeSection === 'about'" class="space-y-8 animate-fade-in">
          <h4 class="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Personal Narrative</h4>
          <div class="space-y-2">
            <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">About Heading</label>
            <input v-model="settings.about_heading" type="text" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
          </div>
          <div class="grid gap-6">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography Paragraph 1</label>
              <textarea v-model="settings.about_paragraph_1" rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography Paragraph 2</label>
              <textarea v-model="settings.about_paragraph_2" rows="4" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
          </div>
        </div>

        <div v-show="activeSection === 'social'" class="space-y-8 animate-fade-in">
          <h4 class="text-lg font-black text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">Digital Footprint</h4>
          <div class="grid gap-6 md:grid-cols-2">
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Contact Email</label>
              <input v-model="settings.contact_email" type="email" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Resume / CV Download URL</label>
              <input v-model="settings.resume_url" type="url" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">GitHub Profile</label>
              <input v-model="settings.github_url" type="url" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="space-y-2">
              <label class="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">LinkedIn Profile</label>
              <input v-model="settings.linkedin_url" type="url" class="w-full px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
