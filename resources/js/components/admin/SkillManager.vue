<script setup lang="ts">
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  X,
  Wrench,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown
} from 'lucide-vue-next';
import { useAdminSkills, type Skill } from '@/composables/admin/useAdminSkills';
import { onMounted } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
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
  deleteSkill
} = useAdminSkills(props.onSuccess);

onMounted(fetchSkills);
</script>

<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Action Bar -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div class="relative max-w-md w-full">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="Search skills by name or category..." 
          class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>
      <button 
        @click="openSkillModal()"
        class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
      >
        <Plus class="h-5 w-5" />
        <span>Add Skill</span>
      </button>
    </div>

    <!-- Skill Grid -->
    <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div v-if="loading" v-for="i in 8" :key="i" class="h-40 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 animate-pulse"></div>
      
      <div v-else v-for="skill in filteredSkills" :key="skill.id" class="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
        <div class="flex items-start justify-between mb-4">
          <div class="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
            <Wrench class="h-6 w-6" />
          </div>
          <div class="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button @click="openSkillModal(skill)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all">
              <Pencil class="h-4 w-4" />
            </button>
            <button @click="deleteSkill(skill.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all">
              <Trash2 class="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div>
          <h4 class="text-lg font-bold text-slate-900 dark:text-white">{{ skill.name }}</h4>
          <p class="text-xs font-bold uppercase tracking-widest text-slate-500 mt-1">{{ skill.category }}</p>
        </div>

        <div class="mt-6">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold text-slate-400">Proficiency</span>
            <span class="text-xs font-black text-indigo-600 dark:text-indigo-400">{{ skill.proficiency }}%</span>
          </div>
          <div class="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              class="h-full bg-indigo-600 transition-all duration-1000"
              :style="{ width: `${skill.proficiency}%` }"
            ></div>
          </div>
        </div>
      </div>

      <div v-if="!loading && filteredSkills.length === 0" class="col-span-full py-20 text-center">
        <p class="text-slate-500 font-medium">No skills found matching your search.</p>
      </div>
    </div>

    <!-- Skill Modal -->
    <transition name="modal">
      <div v-if="skillModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div @click="closeSkillModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md"></div>
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {{ selectedSkill?.id ? 'Refine Skill' : 'New Skill' }}
            </h3>
            <button @click="closeSkillModal" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
              <X class="h-6 w-6" />
            </button>
          </div>

          <div class="p-10 space-y-6">
            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Skill Name</label>
              <input v-model="selectedSkill!.name" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. TypeScript" />
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
              <select v-model="selectedSkill!.category" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none appearance-none">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="mobile">Mobile</option>
                <option value="devops">DevOps</option>
                <option value="design">Design</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Proficiency ({{ selectedSkill!.proficiency }}%)</label>
              </div>
              <input v-model.number="selectedSkill!.proficiency" type="range" min="0" max="100" class="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
            </div>
          </div>

          <div class="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-4">
            <button @click="closeSkillModal" class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
            <button 
              @click="handleSkillSubmit"
              :disabled="submitState === 'submitting'"
              class="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 disabled:opacity-70"
            >
              {{ submitState === 'submitting' ? 'Processing...' : (selectedSkill?.id ? 'Save Changes' : 'Add Skill') }}
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
