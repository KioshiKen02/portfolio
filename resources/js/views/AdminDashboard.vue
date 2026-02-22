<template>
  <div class="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 font-sans">
    
    <!-- Toast Notifications -->
    <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <transition-group name="toast">
        <div 
          v-for="toast in toasts" 
          :key="toast.id" 
          class="flex items-center gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-md transition-all duration-300"
          :class="{
            'border-emerald-200 bg-emerald-50/90 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/90 dark:text-emerald-200': toast.type === 'success',
            'border-rose-200 bg-rose-50/90 text-rose-800 dark:border-rose-800 dark:bg-rose-900/90 dark:text-rose-200': toast.type === 'error',
            'border-blue-200 bg-blue-50/90 text-blue-800 dark:border-blue-800 dark:bg-blue-900/90 dark:text-blue-200': toast.type === 'info'
          }"
        >
          <component :is="toast.icon" class="h-5 w-5 flex-shrink-0" />
          <p class="text-sm font-medium">{{ toast.message }}</p>
          <button @click="removeToast(toast.id)" class="ml-2 opacity-70 hover:opacity-100">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
      </transition-group>
    </div>

    <!-- Login View -->
    <div v-if="!user" class="relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      <!-- Hero Background Gradient -->
      <div class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 opacity-40"></div>
      
      <div class="w-full max-w-md overflow-hidden rounded-[var(--radius-card)] border border-slate-200 bg-white/80 backdrop-blur-xl shadow-2xl dark:border-slate-800 dark:bg-slate-900/80">
        <div class="bg-slate-900/95 px-8 py-10 text-center relative overflow-hidden">
           <!-- Code Window Header Style -->
           <div class="absolute top-4 left-4 flex gap-1.5">
              <div class="h-3 w-3 rounded-full bg-rose-500"></div>
              <div class="h-3 w-3 rounded-full bg-amber-500"></div>
              <div class="h-3 w-3 rounded-full bg-emerald-500"></div>
           </div>

           <div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30">
             <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           </div>
           <h2 class="text-3xl font-bold tracking-tight text-white">Admin Console</h2>
           <p class="mt-2 text-slate-400 font-medium">System Access Portal</p>
        </div>
        
        <div class="p-8">
          <form @submit.prevent="handleLogin" class="space-y-6">
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <input 
                  v-model="loginForm.email" 
                  type="email" 
                  class="input-field pl-10"
                  placeholder="admin@example.com"
                  required
                >
              </div>
            </div>
            
            <div>
              <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Password</label>
              <div class="relative">
                 <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input 
                  v-model="loginForm.password" 
                  :type="showLoginPassword ? 'text' : 'password'" 
                  class="input-field pl-10 pr-10"
                  placeholder="••••••••"
                  required
                >
                <button 
                  type="button"
                  @click="showLoginPassword = !showLoginPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                  :aria-label="showLoginPassword ? 'Hide password' : 'Show password'"
                >
                  <svg v-if="showLoginPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                  <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                </button>
              </div>
            </div>
            
            <div v-if="loginError" class="flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-sm text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
              <svg class="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {{ loginError }}
            </div>

            <button 
              type="submit" 
              :disabled="loginState === 'submitting'"
              class="btn-primary w-full"
            >
              <svg v-if="loginState === 'submitting'" class="h-5 w-5 animate-spin text-white mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <span>{{ loginState === 'submitting' ? 'Authenticating...' : 'Sign In' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>

    <!-- Admin Dashboard Layout -->
    <div v-else class="flex min-h-[calc(100vh-var(--header-height))] bg-slate-50 dark:bg-slate-950 relative">
      
      <!-- Mobile Sidebar Overlay -->
      <div 
        v-if="sidebarOpen" 
        @click="sidebarOpen = false" 
        class="fixed inset-0 z-20 bg-slate-900/50 backdrop-blur-sm lg:hidden top-[var(--header-height)]"
      ></div>

      <!-- Sidebar -->
      <aside 
        class="fixed inset-y-0 left-0 z-30 w-64 transform border-r border-slate-200 bg-white transition-transform duration-300 dark:border-slate-800 dark:bg-slate-900 lg:sticky lg:top-[var(--header-height)] lg:h-[calc(100vh-var(--header-height))] lg:translate-x-0 top-[var(--header-height)]"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <div class="flex h-full flex-col">
          <!-- Logo (Hidden on desktop as App Header exists, visible on mobile inside menu?) -->
          <!-- Actually, since we have the App Header, do we need the 'Admin Console' logo in the sidebar? 
               The request says 'hero header remains fully visible'. 
               If we keep the sidebar below the header, we don't need to duplicate the logo.
               But the sidebar has navigation. Let's keep it clean. -->
          <div class="flex h-16 items-center border-b border-slate-100 px-6 dark:border-slate-800 lg:hidden">
            <span class="text-lg font-bold tracking-tight text-slate-900 dark:text-white">Menu</span>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            <button 
              v-for="tab in tabs" 
              :key="tab.id"
              @click="currentTab = tab.id; sidebarOpen = false"
              class="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              :class="currentTab === tab.id 
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' 
                : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'"
            >
              <component 
                :is="tab.icon" 
                class="h-5 w-5 transition-colors"
                :class="currentTab === tab.id ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'"
              />
              {{ tab.label }}
            </button>
          </nav>

          <!-- User Profile (Bottom Sidebar) -->
          <div class="border-t border-slate-100 p-4 dark:border-slate-800">
            <div class="flex items-center gap-3">
              <div class="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300">
                {{ user.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1 overflow-hidden">
                <p class="truncate text-sm font-medium text-slate-900 dark:text-white">{{ user.name }}</p>
                <p class="truncate text-xs text-slate-500 dark:text-slate-400">{{ user.email }}</p>
              </div>
              <button @click="handleLogout" class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400" title="Sign out">
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
              </button>
            </div>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex flex-1 flex-col">
        <!-- Top Header (Mobile Only - Menu Toggle) -->
        <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 lg:hidden">
          <button @click="sidebarOpen = true" class="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <span class="font-semibold text-slate-900 dark:text-white">Admin Console</span>
          <div class="w-6"></div> <!-- Spacer -->
        </header>

        <!-- Main Scrollable Area -->
        <main class="flex-1 bg-slate-50 p-4 dark:bg-slate-950 lg:p-8">
          <div class="mx-auto max-w-7xl">
            
            <!-- Dashboard View -->
            <div v-if="currentTab === 'dashboard'" class="space-y-6 animate-fade-in">
              <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
              
              <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Stat Card 1 -->
                <div class="card p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Projects</p>
                      <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ projects.length }}</p>
                    </div>
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400">
                      <component :is="ProjectIcon" class="h-6 w-6" />
                    </div>
                  </div>
                </div>

                <!-- Stat Card 2 -->
                <div class="card p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Total Skills</p>
                      <p class="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{{ skills.length }}</p>
                    </div>
                    <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                      <component :is="SkillIcon" class="h-6 w-6" />
                    </div>
                  </div>
                </div>
                
                <!-- Quick Action Card -->
                 <div class="rounded-[var(--radius-card)] border border-slate-200 bg-gradient-to-br from-indigo-600 to-violet-600 p-6 shadow-lg text-white relative overflow-hidden">
                    <!-- Decor -->
                    <div class="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                    
                    <h3 class="font-bold text-lg mb-4 relative z-10">Quick Actions</h3>
                    <div class="flex gap-3 relative z-10">
                       <button @click="currentTab = 'projects'; openProjectModal()" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5">
                          + Add Project
                       </button>
                       <button @click="currentTab = 'skills'; openSkillModal()" class="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold backdrop-blur-sm transition-all hover:-translate-y-0.5">
                          + Add Skill
                       </button>
                    </div>
                 </div>
              </div>

              <!-- Recent Activity Table (Placeholder) -->
              <div class="card">
                <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                  <h3 class="font-semibold text-slate-900 dark:text-white">System Status</h3>
                </div>
                <div class="p-6">
                  <div class="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <span class="relative flex h-3 w-3">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    System Operational • Logged in as {{ user.email }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Projects Management -->
            <div v-if="currentTab === 'projects'" class="space-y-6 animate-fade-in">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Projects Management</h1>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                  <div class="relative w-full sm:w-64">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      placeholder="Search projects..." 
                      class="input-field pl-10"
                    >
                  </div>
                  <button 
                    @click="openProjectModal()"
                    class="btn-primary"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    <span class="hidden sm:inline">New Project</span>
                    <span class="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              <div class="card overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                      <tr>
                        <th class="px-6 py-4 font-medium">Project</th>
                        <th class="px-6 py-4 font-medium">Type</th>
                        <th class="px-6 py-4 font-medium">Tech Stack</th>
                        <th class="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-if="filteredProjects.length === 0">
                        <td colspan="4" class="px-6 py-12 text-center text-slate-500">
                           <div class="flex flex-col items-center justify-center">
                              <component :is="ProjectIcon" class="h-10 w-10 text-slate-300 mb-2" />
                              <p>{{ searchQuery ? 'No matching projects found' : 'No projects found' }}</p>
                           </div>
                        </td>
                      </tr>
                      <tr v-for="project in filteredProjects" :key="project.id" class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td class="px-6 py-4">
                          <div class="flex items-center gap-4">
                            <div class="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                               <img v-if="project.image" :src="`/images/projects/${project.image}`" class="h-full w-full object-cover" />
                               <div v-else class="flex h-full w-full items-center justify-center text-slate-400">
                                 <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                               </div>
                            </div>
                            <div>
                              <div class="font-semibold text-slate-900 dark:text-white">{{ project.title }}</div>
                              <a v-if="project.url" :href="project.url" target="_blank" class="text-xs text-indigo-600 hover:underline dark:text-indigo-400 truncate max-w-[150px] block">{{ project.url }}</a>
                            </div>
                          </div>
                        </td>
                        <td class="px-6 py-4">
                          <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800 dark:bg-slate-800 dark:text-slate-200 capitalize">
                            {{ project.type }}
                          </span>
                        </td>
                        <td class="px-6 py-4">
                           <div class="flex flex-wrap gap-1">
                              <span v-for="(tech, idx) in (Array.isArray(project.technologies) ? project.technologies : [])" :key="idx" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                                 {{ tech }}
                              </span>
                           </div>
                        </td>
                        <td class="px-6 py-4 text-right">
                          <div class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button @click="openProjectModal(project)" class="rounded-lg p-2 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400" title="Edit">
                              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                            </button>
                            <button @click="deleteProject(project.id)" class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400" title="Delete">
                              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Skills Management -->
            <div v-if="currentTab === 'skills'" class="space-y-6 animate-fade-in">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Skills Management</h1>
                <div class="flex items-center gap-3 w-full sm:w-auto">
                   <div class="relative w-full sm:w-64">
                    <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <input 
                      v-model="searchQuery" 
                      type="text" 
                      placeholder="Search skills..." 
                      class="input-field pl-10"
                    >
                  </div>
                  <button 
                    @click="openSkillModal()"
                    class="btn-primary"
                  >
                    <svg class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" /></svg>
                    <span class="hidden sm:inline">New Skill</span>
                    <span class="sm:hidden">Add</span>
                  </button>
                </div>
              </div>

              <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <div v-if="filteredSkills.length === 0" class="col-span-full rounded-[var(--radius-card)] border border-dashed border-slate-300 p-12 text-center text-slate-500 dark:border-slate-700">
                   {{ searchQuery ? 'No matching skills found' : 'No skills added yet.' }}
                </div>
                <div 
                  v-for="skill in filteredSkills" 
                  :key="skill.id" 
                  class="card group relative overflow-hidden p-5 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
                >
                  <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                       <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                          {{ skill.icon || skill.name.charAt(0) }}
                       </div>
                       <div>
                          <h3 class="font-semibold text-slate-900 dark:text-white">{{ skill.name }}</h3>
                          <p class="text-xs text-slate-500">{{ skill.category }}</p>
                       </div>
                    </div>
                    
                    <div class="flex gap-1">
                      <button @click="openSkillModal(skill)" class="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                      </button>
                      <button @click="deleteSkill(skill.id)" class="rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-rose-600 dark:hover:bg-slate-800">
                         <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  
                  <div class="mt-4">
                     <div class="flex items-center justify-between text-xs mb-1">
                        <span class="text-slate-500">Proficiency</span>
                        <span class="font-medium text-slate-700 dark:text-slate-300">{{ skill.proficiency }}%</span>
                     </div>
                     <div class="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                        <div class="h-full rounded-full bg-indigo-500 transition-all duration-1000" :style="{ width: `${skill.proficiency}%` }"></div>
                     </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Messages Management -->
            <div v-if="currentTab === 'messages'" class="space-y-6 animate-fade-in">
              <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
                <div class="relative w-full sm:w-64">
                   <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                     <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                   </div>
                   <input 
                     v-model="searchQuery" 
                     type="text" 
                     placeholder="Search messages..." 
                     class="input-field pl-10"
                   >
                </div>
              </div>

              <div class="card overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-sm">
                    <thead class="bg-slate-50 text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
                      <tr>
                        <th class="px-6 py-4 font-medium">Status</th>
                        <th class="px-6 py-4 font-medium">Sender</th>
                        <th class="px-6 py-4 font-medium">Subject</th>
                        <th class="px-6 py-4 font-medium">Date</th>
                        <th class="px-6 py-4 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr v-if="filteredMessages.length === 0">
                        <td colspan="5" class="px-6 py-12 text-center text-slate-500">
                           <div class="flex flex-col items-center justify-center">
                              <component :is="MessageIcon" class="h-10 w-10 text-slate-300 mb-2" />
                              <p>{{ searchQuery ? 'No matching messages found' : 'No messages yet' }}</p>
                           </div>
                        </td>
                      </tr>
                      <tr v-for="message in filteredMessages" :key="message.id" class="group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer" @click="openMessageModal(message)">
                        <td class="px-6 py-4">
                           <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium" 
                            :class="{
                              'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300': message.status === 'new',
                              'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300': message.status === 'read',
                              'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300': message.status === 'replied'
                            }">
                             <span class="h-1.5 w-1.5 rounded-full" :class="{
                               'bg-indigo-500': message.status === 'new',
                               'bg-slate-500': message.status === 'read',
                               'bg-emerald-500': message.status === 'replied'
                             }"></span>
                             {{ message.status.charAt(0).toUpperCase() + message.status.slice(1) }}
                           </span>
                        </td>
                        <td class="px-6 py-4">
                          <div class="font-medium text-slate-900 dark:text-white">{{ message.name }}</div>
                          <div class="text-xs text-slate-500">{{ message.email }}</div>
                        </td>
                        <td class="px-6 py-4 max-w-xs truncate text-slate-600 dark:text-slate-400">
                          {{ message.subject }}
                        </td>
                        <td class="px-6 py-4 text-slate-500">
                          {{ new Date(message.created_at).toLocaleDateString() }}
                        </td>
                        <td class="px-6 py-4 text-right">
                          <button @click.stop="deleteMessage(message.id)" class="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 dark:hover:text-rose-400">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Site Settings -->
            <div v-if="currentTab === 'settings'" class="max-w-4xl animate-fade-in">
              <div class="flex items-center justify-between mb-6">
                 <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Site Configuration</h1>
                 <button 
                   @click="saveSettings" 
                   class="btn-primary"
                 >
                   Save Changes
                 </button>
              </div>

              <div class="card overflow-hidden">
                <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800 flex justify-between items-center">
                   <div>
                      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">General Settings</h2>
                      <p class="text-sm text-slate-500">Manage global site configuration variables.</p>
                   </div>
                   <button @click="settings.push({ key: '', value: '', type: 'text', group: 'general' })" class="text-sm text-indigo-600 font-medium hover:underline">+ Add Field</button>
                </div>
                
                <div class="p-6 space-y-6">
                   <div v-if="settings.length === 0" class="text-center py-8 text-slate-500">
                      No settings found. Add one to get started.
                   </div>
                   
                   <div v-for="(setting, index) in settings" :key="index" class="flex gap-4 items-start group border-b border-slate-50 pb-6 last:border-0 last:pb-0 dark:border-slate-800">
                      <div class="w-1/3">
                         <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Key</label>
                         <input v-model="setting.key" type="text" class="input-field font-mono text-sm" placeholder="e.g. site_title">
                      </div>
                      <div class="flex-1">
                         <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Value</label>
                         <textarea v-if="setting.type === 'textarea'" v-model="setting.value" rows="3" class="input-field text-sm"></textarea>
                         <input v-else v-model="setting.value" :type="setting.type" class="input-field text-sm">
                      </div>
                      <div class="w-28">
                         <label class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Type</label>
                         <select v-model="setting.type" class="input-field text-sm py-2">
                            <option value="text">Text</option>
                            <option value="textarea">Long Text</option>
                            <option value="email">Email</option>
                            <option value="url">URL</option>
                         </select>
                      </div>
                      <div class="pt-6">
                         <button @click="settings.splice(index, 1)" class="p-2 text-slate-400 hover:text-rose-500 transition-colors" title="Remove Field">
                            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <!-- Profile Settings -->
            <div v-if="currentTab === 'profile'" class="max-w-2xl animate-fade-in">
              <h1 class="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Profile Settings</h1>
              
              <div class="card overflow-hidden">
                <div class="border-b border-slate-100 px-6 py-4 dark:border-slate-800">
                   <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
                   <p class="text-sm text-slate-500">Update your account details and password.</p>
                </div>
                
                <div class="p-6">
                  <form @submit.prevent="handleUpdateProfile" class="space-y-6">
                    <div class="grid gap-6 md:grid-cols-2">
                      <div>
                        <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Full Name</label>
                        <input 
                          v-model="profileForm.name" 
                          type="text" 
                          class="input-field"
                        >
                      </div>
                      <div>
                        <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                        <input 
                          v-model="profileForm.email" 
                          type="email" 
                          class="input-field"
                        >
                      </div>
                    </div>
                    
                    <div class="rounded-lg bg-slate-50 p-4 dark:bg-slate-800/50">
                      <h3 class="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Change Password</h3>
                      <div class="grid gap-6 md:grid-cols-2">
                        <div>
                          <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">New Password</label>
                        <div class="relative">
                          <input 
                            v-model="profileForm.password" 
                            :type="showProfilePassword ? 'text' : 'password'" 
                            class="input-field pr-10"
                            placeholder="Leave blank to keep current"
                          >
                          <button 
                            type="button"
                            @click="showProfilePassword = !showProfilePassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                            :aria-label="showProfilePassword ? 'Hide password' : 'Show password'"
                          >
                            <svg v-if="showProfilePassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </div>
                        </div>
                        <div>
                          <label class="mb-2 block text-sm font-semibold text-slate-700 dark:text-slate-300">Confirm Password</label>
                        <div class="relative">
                          <input 
                            v-model="profileForm.password_confirmation" 
                            :type="showProfileConfirmPassword ? 'text' : 'password'" 
                            class="input-field pr-10"
                            placeholder="Confirm new password"
                          >
                          <button 
                            type="button"
                            @click="showProfileConfirmPassword = !showProfileConfirmPassword"
                            class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
                            :aria-label="showProfileConfirmPassword ? 'Hide password' : 'Show password'"
                          >
                            <svg v-if="showProfileConfirmPassword" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                            <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                          </button>
                        </div>
                        </div>
                      </div>
                    </div>

                    <div class="flex items-center justify-end gap-4 border-t border-slate-100 pt-6 dark:border-slate-800">
                       <button 
                        type="button" 
                        @click="fetchCurrentUser"
                        class="btn-secondary"
                      >
                        Reset
                      </button>
                      <button 
                        type="submit" 
                        :disabled="profileSubmitting"
                        class="btn-primary"
                      >
                        {{ profileSubmitting ? 'Saving...' : 'Save Changes' }}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>

    <!-- Modals -->
    <!-- Project Modal -->
    <div v-if="showProjectModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ editingProject ? 'Edit Project' : 'New Project' }}</h3>
          <button @click="closeProjectModal" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveProject" class="p-6 space-y-5">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project Title</label>
            <input v-model="projectForm.title" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" required>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea v-model="projectForm.description" rows="3" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" required></textarea>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Image Filename</label>
               <input v-model="projectForm.image" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" placeholder="dashboard.png">
             </div>
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Project Type</label>
               <select v-model="projectForm.type" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
                 <option value="web">Web Application</option>
                 <option value="mobile">Mobile Application</option>
                 <option value="other">Other</option>
               </select>
             </div>
          </div>
          <div class="grid gap-5 sm:grid-cols-2">
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Live URL</label>
               <input v-model="projectForm.url" type="url" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
             </div>
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">GitHub URL</label>
               <input v-model="projectForm.github_url" type="url" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800">
             </div>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Technologies <span class="text-slate-400 font-normal">(Comma separated)</span></label>
            <input v-model="projectForm.technologies" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" placeholder="Laravel, Vue, Tailwind">
          </div>
          
          <div class="flex justify-end pt-2">
            <button type="submit" class="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm">
              {{ editingProject ? 'Update Project' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Skill Modal -->
    <div v-if="showSkillModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="w-full max-w-md rounded-2xl bg-white shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ editingSkill ? 'Edit Skill' : 'New Skill' }}</h3>
          <button @click="closeSkillModal" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <form @submit.prevent="saveSkill" class="p-6 space-y-5">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Skill Name</label>
            <input v-model="skillForm.name" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" required>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
            <input v-model="skillForm.category" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" placeholder="Backend, Frontend..." required>
          </div>
          <div class="grid gap-5 grid-cols-2">
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Proficiency (%)</label>
               <input v-model.number="skillForm.proficiency" type="number" min="0" max="100" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" required>
             </div>
             <div>
               <label class="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">Icon (Text)</label>
               <input v-model="skillForm.icon" type="text" class="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800" placeholder="e.g. L">
             </div>
          </div>
          
          <div class="flex justify-end pt-2">
            <button type="submit" class="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm">
              {{ editingSkill ? 'Update Skill' : 'Create Skill' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Message Modal -->
    <div v-if="showMessageModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in">
      <div class="w-full max-w-2xl rounded-2xl bg-white shadow-2xl dark:bg-slate-900 max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-700 flex flex-col">
        <div class="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <div class="flex items-center gap-3">
             <div class="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
             </div>
             <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ selectedMessage?.name }}</h3>
                <p class="text-xs text-slate-500">{{ selectedMessage?.email }}</p>
             </div>
          </div>
          <button @click="closeMessageModal" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-200">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <div class="p-6 flex-1 overflow-y-auto">
           <div class="mb-6">
              <div class="flex items-center justify-between mb-2">
                 <h4 class="font-semibold text-slate-900 dark:text-white">{{ selectedMessage?.subject }}</h4>
                 <span class="text-xs text-slate-500">{{ new Date(selectedMessage?.created_at).toLocaleString() }}</span>
              </div>
              <div class="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-800/50 dark:text-slate-300 whitespace-pre-wrap">
                {{ selectedMessage?.message }}
              </div>
           </div>

           <div class="border-t border-slate-100 pt-6 dark:border-slate-800">
              <h4 class="mb-3 font-semibold text-slate-900 dark:text-white">Reply via Email</h4>
              <textarea 
                v-model="replyMessage" 
                rows="5" 
                class="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800"
                placeholder="Type your reply here..."
              ></textarea>
              <div class="flex justify-end pt-4">
                <button 
                  @click="sendReply" 
                  :disabled="sendingReply || !replyMessage.trim()"
                  class="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm"
                >
                  <svg v-if="sendingReply" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <svg v-else class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  {{ sendingReply ? 'Sending...' : 'Send Reply' }}
                </button>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-desc">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
        <div class="flex items-center justify-center mb-4">
          <div class="rounded-full bg-rose-100 p-3 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
             <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
        </div>
        <h3 id="modal-title" class="mb-2 text-center text-xl font-bold text-slate-900 dark:text-white">Delete Message?</h3>
        <p id="modal-desc" class="mb-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Are you sure you want to delete this message? This action cannot be undone.
        </p>
        <div class="grid grid-cols-2 gap-3">
          <button 
            @click="showDeleteModal = false"
            class="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="confirmDelete"
            :disabled="isDeleting"
            class="flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:opacity-70 disabled:cursor-not-allowed shadow-sm transition-colors"
          >
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, shallowRef, watch, h } from 'vue';
import axios from 'axios';

// Helper to create functional icon components
const createIcon = (d, baseClasses = '') => ({
  render() {
    return h('svg', { 
      fill: 'none', 
      viewBox: '0 0 24 24', 
      stroke: 'currentColor',
      class: baseClasses
    }, [
      h('path', { 
        'stroke-linecap': 'round', 
        'stroke-linejoin': 'round', 
        'stroke-width': '2', 
        d: d 
      })
    ]);
  }
});

// Icons (Converted to render functions to support runtime-only build)
const DashboardIcon = createIcon('M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z');
const ProjectIcon = createIcon('M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10');
const SkillIcon = createIcon('M13 10V3L4 14h7v7l9-11h-7z');
const MessageIcon = createIcon('M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z');
const UserIcon = createIcon('M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
const SettingsIcon = createIcon('M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z');
const SuccessIcon = createIcon('M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', 'text-emerald-500');
const ErrorIcon = createIcon('M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', 'text-rose-500');

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: shallowRef(DashboardIcon) },
  { id: 'projects', label: 'Projects', icon: shallowRef(ProjectIcon) },
  { id: 'skills', label: 'Skills', icon: shallowRef(SkillIcon) },
  { id: 'messages', label: 'Messages', icon: shallowRef(MessageIcon) },
  { id: 'settings', label: 'Site Settings', icon: shallowRef(SettingsIcon) },
  { id: 'profile', label: 'Profile', icon: shallowRef(UserIcon) },
];

// Layout State
const sidebarOpen = ref(false);
const currentTab = ref('dashboard');
const user = ref(null);

watch(currentTab, () => {
  searchQuery.value = '';
});

// Toast State
const toasts = ref([]);
let toastId = 0;

function addToast(message, type = 'info') {
  const id = toastId++;
  const icon = type === 'success' ? SuccessIcon : (type === 'error' ? ErrorIcon : SuccessIcon);
  toasts.value.push({ id, message, type, icon });
  setTimeout(() => removeToast(id), 5000);
}

function removeToast(id) {
  toasts.value = toasts.value.filter(t => t.id !== id);
}

// Auth State
const loginForm = reactive({ email: '', password: '' });
const loginState = ref('idle');
const loginError = ref('');
const showLoginPassword = ref(false);

// Delete Confirmation State
const showDeleteModal = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

// Data State
const projects = ref([]);
const skills = ref([]);
const searchQuery = ref('');

const filteredProjects = computed(() => {
  if (!searchQuery.value) return projects.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return projects.value.filter(p => 
    p.title.toLowerCase().includes(lowerQuery) || 
    p.description.toLowerCase().includes(lowerQuery) ||
    (Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(lowerQuery)))
  );
});

const filteredSkills = computed(() => {
  if (!searchQuery.value) return skills.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return skills.value.filter(s => 
    s.name.toLowerCase().includes(lowerQuery) || 
    s.category.toLowerCase().includes(lowerQuery)
  );
});

// Messages State
const messages = ref([]);
const filteredMessages = computed(() => {
  if (!searchQuery.value) return messages.value;
  const lowerQuery = searchQuery.value.toLowerCase();
  return messages.value.filter(m => 
    m.name.toLowerCase().includes(lowerQuery) || 
    m.email.toLowerCase().includes(lowerQuery) || 
    m.subject.toLowerCase().includes(lowerQuery)
  );
});
const showMessageModal = ref(false);
const selectedMessage = ref(null);
const replyMessage = ref('');
const sendingReply = ref(false);

// Project Modal State
const showProjectModal = ref(false);
const editingProject = ref(null);
const projectForm = reactive({
  title: '',
  description: '',
  image: '',
  url: '',
  github_url: '',
  type: 'web',
  technologies: '',
});

// Skill Modal State
const showSkillModal = ref(false);
const editingSkill = ref(null);
const skillForm = reactive({
  name: '',
  category: '',
  proficiency: 80,
  icon: '',
});

// Profile State
const profileForm = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
});
const profileSubmitting = ref(false);
const showProfilePassword = ref(false);
const showProfileConfirmPassword = ref(false);

// --- Auth Functions ---

function setToken(token) {
  window.localStorage.setItem('access_token', token);
  axios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

function clearToken() {
  window.localStorage.removeItem('access_token');
  delete axios.defaults.headers.common.Authorization;
}

async function fetchCurrentUser() {
  try {
    const { data } = await axios.get('/auth/me');
    user.value = data;
    profileForm.name = data.name;
    profileForm.email = data.email;
    await loadData();
  } catch {
    handleLogout();
  }
}

async function handleLogin() {
  loginState.value = 'submitting';
  loginError.value = '';

  try {
    const { data } = await axios.post('/auth/login', {
      email: loginForm.email,
      password: loginForm.password,
    });

    if (data && data.access_token) {
      setToken(data.access_token);
      await fetchCurrentUser();
      addToast('Welcome back!', 'success');
    }
  } catch {
    loginError.value = 'Invalid credentials.';
    addToast('Login failed. Please check your credentials.', 'error');
  } finally {
    loginState.value = 'idle';
  }
}

async function handleLogout() {
  try { await axios.post('/auth/logout'); } catch {}
  clearToken();
  user.value = null;
  // Clear sensitive data on logout
  projects.value = [];
  skills.value = [];
  messages.value = [];
  searchQuery.value = '';
  addToast('Signed out successfully.', 'info');
}

// Settings State
const settings = ref([]);
const settingsLoading = ref(false);

// --- Settings Functions ---
async function loadSettings() {
  settingsLoading.value = true;
  try {
    const { data } = await axios.get('/admin/settings');
    settings.value = data;
    // Ensure default groups exist if empty
    if (settings.value.length === 0) {
       settings.value = [
          { key: 'site_title', value: '', type: 'text', group: 'general' },
          { key: 'contact_email', value: '', type: 'email', group: 'general' },
          { key: 'linkedin_url', value: '', type: 'url', group: 'social' },
          { key: 'github_url', value: '', type: 'url', group: 'social' },
       ];
    }
  } catch {
    addToast('Failed to load settings.', 'error');
  } finally {
    settingsLoading.value = false;
  }
}

async function saveSettings() {
  try {
    await axios.post('/admin/settings', { settings: settings.value });
    addToast('Settings saved successfully.', 'success');
  } catch {
    addToast('Failed to save settings.', 'error');
  }
}

function addSettingField() {
  settings.value.push({
    key: `new_setting_${Date.now()}`,
    value: '',
    type: 'text',
    group: 'general'
  });
}

function removeSettingField(index) {
  settings.value.splice(index, 1);
}

async function loadData() {
  const results = await Promise.allSettled([
    axios.get('/projects'),
    axios.get('/skills'),
    axios.get('/admin/contacts'),
    axios.get('/admin/settings')
  ]);

  const [pRes, sRes, mRes, setRes] = results;

  if (pRes.status === 'fulfilled') projects.value = pRes.value.data;
  if (sRes.status === 'fulfilled') skills.value = sRes.value.data;
  if (mRes.status === 'fulfilled') messages.value = mRes.value.data.data;
  
  if (setRes.status === 'fulfilled') {
     settings.value = setRes.value.data;
  }
}

// --- Message Functions ---

async function openMessageModal(message) {
  selectedMessage.value = message;
  replyMessage.value = '';
  showMessageModal.value = true;
  
  if (message.status === 'new') {
    try {
      await axios.get(`/admin/contacts/${message.id}`);
      message.status = 'read';
    } catch {}
  }
}

function closeMessageModal() {
  showMessageModal.value = false;
  selectedMessage.value = null;
}

async function sendReply() {
  if (!replyMessage.value.trim()) return;
  
  sendingReply.value = true;
  try {
    await axios.post(`/admin/contacts/${selectedMessage.value.id}/reply`, {
      reply_message: replyMessage.value
    });
    
    selectedMessage.value.status = 'replied';
    addToast('Reply sent successfully.', 'success');
    closeMessageModal();
  } catch {
    addToast('Failed to send reply.', 'error');
  } finally {
    sendingReply.value = false;
  }
}

async function deleteMessage(id) {
  itemToDelete.value = { id, type: 'message' };
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;

  isDeleting.value = true;
  const { id, type } = itemToDelete.value;

  try {
    if (type === 'message') {
      await axios.delete(`/admin/contacts/${id}`);
      messages.value = messages.value.filter(m => m.id !== id);
      addToast('Message deleted.', 'success');
      if (selectedMessage.value && selectedMessage.value.id === id) {
        closeMessageModal();
      }
    }
  } catch {
    addToast('Failed to delete item.', 'error');
  } finally {
    isDeleting.value = false;
    showDeleteModal.value = false;
    itemToDelete.value = null;
  }
}

// --- Project Functions ---

function openProjectModal(project = null) {
  editingProject.value = project;
  if (project) {
    projectForm.title = project.title;
    projectForm.description = project.description;
    projectForm.image = project.image;
    projectForm.url = project.url;
    projectForm.github_url = project.github_url;
    projectForm.type = project.type;
    // Handle technologies parsing
    let techs = project.technologies;
    if (Array.isArray(techs)) {
       projectForm.technologies = techs.join(', ');
    } else {
       projectForm.technologies = techs || '';
    }
  } else {
    // Reset form
    Object.keys(projectForm).forEach(k => projectForm[k] = k === 'type' ? 'web' : '');
  }
  showProjectModal.value = true;
}

function closeProjectModal() {
  showProjectModal.value = false;
  editingProject.value = null;
}

async function saveProject() {
  try {
    // Parse technologies
    let techs = [];
    if (projectForm.technologies) {
      techs = projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean);
    }

    const payload = { ...projectForm, technologies: techs };

    if (editingProject.value) {
      await axios.put(`/admin/projects/${editingProject.value.id}`, payload);
      addToast('Project updated successfully.', 'success');
    } else {
      await axios.post('/admin/projects', payload);
      addToast('Project created successfully.', 'success');
    }
    
    await loadData();
    closeProjectModal();
  } catch (e) {
    addToast('Failed to save project.', 'error');
  }
}

async function deleteProject(id) {
  if (!confirm('Are you sure you want to delete this project?')) return;
  try {
    await axios.delete(`/admin/projects/${id}`);
    addToast('Project deleted.', 'success');
    await loadData();
  } catch {
    addToast('Failed to delete project.', 'error');
  }
}

// --- Skill Functions ---

function openSkillModal(skill = null) {
  editingSkill.value = skill;
  if (skill) {
    skillForm.name = skill.name;
    skillForm.category = skill.category;
    skillForm.proficiency = skill.proficiency;
    skillForm.icon = skill.icon;
  } else {
    skillForm.name = '';
    skillForm.category = '';
    skillForm.proficiency = 80;
    skillForm.icon = '';
  }
  showSkillModal.value = true;
}

function closeSkillModal() {
  showSkillModal.value = false;
  editingSkill.value = null;
}

async function saveSkill() {
  try {
    if (editingSkill.value) {
      await axios.put(`/admin/skills/${editingSkill.value.id}`, skillForm);
      addToast('Skill updated successfully.', 'success');
    } else {
      await axios.post('/admin/skills', skillForm);
      addToast('Skill created successfully.', 'success');
    }
    await loadData();
    closeSkillModal();
  } catch {
    addToast('Failed to save skill.', 'error');
  }
}

async function deleteSkill(id) {
  if (!confirm('Are you sure?')) return;
  try {
    await axios.delete(`/admin/skills/${id}`);
    addToast('Skill deleted.', 'success');
    await loadData();
  } catch {
    addToast('Failed to delete skill.', 'error');
  }
}

// --- Profile Functions ---

async function handleUpdateProfile() {
  profileSubmitting.value = true;
  
  try {
    const { data } = await axios.put('/auth/profile', {
      name: profileForm.name,
      email: profileForm.email,
      password: profileForm.password || undefined,
      password_confirmation: profileForm.password_confirmation || undefined,
    });
    
    user.value = data;
    addToast('Profile updated successfully.', 'success');
    profileForm.password = '';
    profileForm.password_confirmation = '';
  } catch (error) {
    addToast(error.response?.data?.message || 'Failed to update profile.', 'error');
  } finally {
    profileSubmitting.value = false;
  }
}

onMounted(async () => {
  const token = window.localStorage.getItem('access_token');
  if (token) {
    setToken(token);
    await fetchCurrentUser();
  }
});
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
