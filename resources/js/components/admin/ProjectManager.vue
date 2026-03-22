<script setup lang="ts">
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink, 
  Github, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Filter,
  ArrowUpDown,
  FolderKanban,
  X
} from 'lucide-vue-next';
import { useAdminProjects, type Project } from '@/composables/admin/useAdminProjects';
import { onMounted } from 'vue';

const props = defineProps<{
  onSuccess?: () => void;
}>();

const {
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
  deleteProject
} = useAdminProjects(props.onSuccess);

onMounted(fetchProjects);
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
          placeholder="Search projects by title, tech, or description..." 
          class="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>
      <div class="flex items-center gap-3">
        <button class="p-3 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Filter class="h-5 w-5" />
        </button>
        <button 
          @click="openProjectModal()"
          class="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus class="h-5 w-5" />
          <span>Add Project</span>
        </button>
      </div>
    </div>

    <!-- Project Table Card -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
      <div class="overflow-x-auto custom-scrollbar">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <th class="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">
                <div class="flex items-center gap-2 cursor-pointer hover:text-slate-900 dark:hover:text-slate-200 transition-colors">
                  Project Detail
                  <ArrowUpDown class="h-3 w-3" />
                </div>
              </th>
              <th class="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Type</th>
              <th class="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500">Tech Stack</th>
              <th class="px-8 py-5 text-xs font-bold uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-50 dark:divide-slate-800">
            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800"></div>
                  <div class="space-y-2">
                    <div class="h-4 w-32 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    <div class="h-3 w-24 bg-slate-100 dark:bg-slate-800 rounded"></div>
                  </div>
                </div>
              </td>
              <td colspan="3" class="px-8 py-6"><div class="h-4 w-full bg-slate-50 dark:bg-slate-800/50 rounded"></div></td>
            </tr>
            <tr v-else v-for="project in filteredProjects" :key="project.id" class="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
              <td class="px-8 py-6">
                <div class="flex items-center gap-4">
                  <div class="h-14 w-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 overflow-hidden flex items-center justify-center border border-slate-100 dark:border-slate-800">
                    <img v-if="project.images?.[0]" :src="project.images[0]" class="h-full w-full object-cover" />
                    <FolderKanban v-else class="h-6 w-6 text-indigo-500" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-bold text-slate-900 dark:text-white truncate">{{ project.title }}</p>
                    <p class="text-xs text-slate-500 mt-1 truncate max-w-[200px]">{{ project.description }}</p>
                  </div>
                </div>
              </td>
              <td class="px-8 py-6">
                <span class="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                  {{ project.type }}
                </span>
              </td>
              <td class="px-8 py-6">
                <div class="flex flex-wrap gap-1.5 max-w-[300px]">
                  <span v-for="tech in project.technologies.slice(0, 3)" :key="tech" class="px-2 py-0.5 rounded-md bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                    {{ tech }}
                  </span>
                  <span v-if="project.technologies.length > 3" class="text-[10px] font-bold text-slate-400">
                    +{{ project.technologies.length - 3 }} more
                  </span>
                </div>
              </td>
              <td class="px-8 py-6 text-right">
                <div class="flex items-center justify-end gap-2">
                  <button @click="openProjectModal(project)" class="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-all" title="Edit">
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button @click="deleteProject(project.id)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-all" title="Delete">
                    <Trash2 class="h-4 w-4" />
                  </button>
                  <div class="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>
                  <button class="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-all">
                    <MoreVertical class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="!loading && filteredProjects.length === 0">
              <td colspan="4" class="px-8 py-20 text-center">
                <div class="flex flex-col items-center gap-3">
                  <div class="h-16 w-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300">
                    <Search class="h-8 w-8" />
                  </div>
                  <p class="text-slate-500 font-medium">No projects found matching your search.</p>
                  <button @click="searchQuery = ''" class="text-indigo-600 font-bold text-sm hover:underline">Clear all filters</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination -->
      <div class="px-8 py-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/30">
        <p class="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Showing <span class="text-slate-900 dark:text-white">{{ filteredProjects.length }}</span> Results
        </p>
        <div class="flex items-center gap-2">
          <button class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-50" disabled>
            <ChevronLeft class="h-4 w-4" />
          </button>
          <button class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:bg-white dark:hover:bg-slate-800">
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Project Modal (Sophisticated implementation) -->
    <transition name="modal">
      <div v-if="projectModalOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4 sm:p-6">
        <div @click="closeProjectModal" class="absolute inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"></div>
        <div class="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
          <!-- Modal Header -->
          <div class="px-10 py-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
            <div>
              <h3 class="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ selectedProject?.id ? 'Refine Project' : 'New Deployment' }}
              </h3>
              <p class="text-sm text-slate-500 font-medium">Define project parameters and specifications</p>
            </div>
            <button @click="closeProjectModal" class="p-3 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors">
              <X class="h-6 w-6" />
            </button>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-10 overflow-y-auto custom-scrollbar space-y-8">
            <div class="grid gap-8 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Project Title</label>
                <input v-model="selectedProject!.title" type="text" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="e.g. Neural Nexus Dashboard" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Category</label>
                <select v-model="selectedProject!.type" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none appearance-none">
                  <option value="web">Web Application</option>
                  <option value="mobile">Mobile App</option>
                  <option value="desktop">Desktop Software</option>
                  <option value="api">Backend API</option>
                </select>
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-black uppercase tracking-widest text-slate-500">Project Description</label>
              <textarea v-model="selectedProject!.description" rows="4" class="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none resize-none" placeholder="Elaborate on the project's architecture, challenges, and solutions..."></textarea>
            </div>

            <div class="grid gap-8 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Deployment URL</label>
                <div class="relative">
                  <ExternalLink class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input v-model="selectedProject!.url" type="url" class="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="https://..." />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-500">Source Control</label>
                <div class="relative">
                  <Github class="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input v-model="selectedProject!.github_url" type="url" class="w-full pl-12 pr-5 py-4 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none" placeholder="https://github.com/..." />
                </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="px-10 py-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-4 shrink-0">
            <button @click="closeProjectModal" class="px-8 py-4 text-sm font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
            <button 
              @click="handleProjectSubmit"
              :disabled="submitState === 'submitting'"
              class="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70"
            >
              <span v-if="submitState === 'submitting'">Processing...</span>
              <span v-else>{{ selectedProject?.id ? 'Commit Changes' : 'Initialize Project' }}</span>
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

.custom-scrollbar::-webkit-scrollbar { height: 6px; width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
</style>
