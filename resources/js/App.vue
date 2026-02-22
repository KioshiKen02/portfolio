<template>
  <div class="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-white theme-transition">
    <header class="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80 h-[var(--header-height)]">
      <nav class="container mx-auto flex h-full items-center justify-between px-6">
        <div class="flex items-center gap-3">
          <span class="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-lg dark:bg-white dark:text-slate-900">
            <span class="text-xl font-bold">M</span>
          </span>
          <div class="leading-tight">
            <div class="text-sm font-bold tracking-tight text-slate-900 dark:text-white">
              Melvin Rey C Tambis
            </div>
            <div class="text-xs font-medium text-slate-500 dark:text-slate-400">
              System Programmer
            </div>
          </div>
        </div>
        <div class="hidden items-center gap-8 text-sm font-medium md:flex">
          <button type="button" class="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="navigateAndScroll('hero')">
            Home
          </button>
          <button type="button" class="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="navigateAndScroll('about')">
            About
          </button>
          <button type="button" class="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="navigateAndScroll('projects')">
            Projects
          </button>
          <button type="button" class="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="navigateAndScroll('skills')">
            Skills
          </button>
          <button type="button" class="text-slate-600 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white" @click="navigateAndScroll('contact')">
            Contact
          </button>
          <RouterLink to="/admin" class="rounded-lg border border-slate-200 px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:text-white dark:hover:bg-slate-900">
            Admin
          </RouterLink>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-white"
            @click="toggleTheme"
            aria-label="Toggle theme"
          >
            <span v-if="theme === 'light'">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            </span>
            <span v-else>
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </span>
          </button>
        </div>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Initialize theme based on what's already in the DOM (set by app.blade.php)
const isDark = document.documentElement.classList.contains('dark');
const theme = ref(isDark ? 'dark' : 'light');

const router = useRouter();
const route = useRoute();

function applyTheme(value) {
  const root = document.documentElement;

  if (value === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

function toggleTheme() {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
  window.localStorage.setItem('theme', theme.value);
  applyTheme(theme.value);
}

function scrollToSection(id) {
  const el = document.getElementById(id);

  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function navigateAndScroll(id) {
  if (route.path !== '/') {
    router
      .push({ path: '/', hash: `#${id}` })
      .then(() => {
        window.setTimeout(() => scrollToSection(id), 250);
      });
  } else {
    scrollToSection(id);
  }
}

onMounted(() => {
  applyTheme(theme.value);
});
</script>

<style scoped>
.theme-transition {
  transition: background-color 300ms ease, color 300ms ease;
}
</style>

