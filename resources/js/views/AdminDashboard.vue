<template>
  <div class="min-h-[calc(100vh-64px)] bg-slate-50 py-10 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
    <div class="container mx-auto px-4">
      <div class="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 class="text-2xl font-semibold tracking-tight sm:text-3xl">
            Admin panel
          </h1>
          <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Manage projects and skills protected by JWT authentication.
          </p>
        </div>
        <div class="flex items-center gap-3 text-xs">
          <div
            v-if="user"
            class="inline-flex items-center gap-2 rounded-full bg-slate-900/90 px-3 py-1 text-slate-50 dark:bg-slate-900"
          >
            <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/90 text-xs font-semibold text-slate-950">
              {{ userInitials }}
            </span>
            <div class="leading-tight">
              <div class="font-medium">
                {{ user.name || 'Admin user' }}
              </div>
              <div class="text-[11px] text-slate-300">
                Authenticated with JWT
              </div>
            </div>
          </div>
          <button
            v-if="user"
            type="button"
            class="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm transition hover:border-rose-400 hover:text-rose-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-rose-400 dark:hover:text-rose-300"
            @click="handleLogout"
          >
            Log out
          </button>
        </div>
      </div>
      <div v-if="!user" class="grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1.2fr)]">
        <div class="rounded-2xl border border-slate-200 bg-slate-100 p-5 text-slate-900 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-50">
          <h2 class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 dark:text-slate-50">
            Sign in
          </h2>
          <p class="mb-4 text-xs text-slate-700 dark:text-slate-300">
            Use the seeded admin user email and password to authenticate. The token is stored in local storage and attached to every admin API request.
          </p>
          <form class="space-y-3 text-sm" @submit.prevent="handleLogin">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-800 dark:text-slate-200">
                Email
              </label>
              <input
                v-model.trim="loginForm.email"
                type="email"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-800 dark:text-slate-200">
                Password
              </label>
              <input
                v-model.trim="loginForm.password"
                type="password"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              :disabled="loginState === 'submitting'"
            >
              <span
                v-if="loginState === 'submitting'"
                class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent"
              ></span>
              <span>
                {{ loginState === 'submitting' ? 'Signing in...' : 'Sign in' }}
              </span>
            </button>
            <p v-if="loginError" class="text-xs text-rose-500">
              {{ loginError }}
            </p>
          </form>
        </div>
        <div class="rounded-2xl bg-slate-950 p-5 text-xs text-slate-100 dark:bg-slate-900">
          <div class="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            How this admin panel works
          </div>
          <ul class="space-y-2 text-slate-200">
            <li>JWT-based auth guard configured on the Laravel API.</li>
            <li>Tokens are stored client-side and attached to axios requests.</li>
            <li>Admin routes are protected by the api guard and prefix.</li>
            <li>Projects and skills are managed through RESTful JSON endpoints.</li>
          </ul>
        </div>
      </div>
      <div v-else class="mt-6 grid gap-6 md:grid-cols-2">
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Add project
          </h2>
          <form class="space-y-3 text-sm" @submit.prevent="handleCreateProject">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                Title
              </label>
              <input
                v-model.trim="projectForm.title"
                type="text"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                Description
              </label>
              <textarea
                v-model.trim="projectForm.description"
                rows="3"
                class="form-control block w-full resize-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              ></textarea>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  Image filename
                </label>
                <input
                  v-model.trim="projectForm.image"
                  type="text"
                  class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="dashboard.png (stored in public/images/projects)"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  Live URL
                </label>
                <input
                  v-model.trim="projectForm.url"
                  type="url"
                  class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="https://"
                />
              </div>
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  GitHub URL
                </label>
                <input
                  v-model.trim="projectForm.github_url"
                  type="url"
                  class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="https://github.com/"
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  Type
                </label>
                <select
                  v-model="projectForm.type"
                  class="form-select block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                >
                  <option value="web">Laravel + Vue web app</option>
                  <option value="mobile">Flutter + API mobile app</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                Technologies
              </label>
              <input
                v-model.trim="projectForm.technologies"
                type="text"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="comma separated, e.g. Laravel, Vue 3, Tailwind"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              :disabled="projectSubmitting"
            >
              <span
                v-if="projectSubmitting"
                class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent"
              ></span>
              <span>
                {{ projectSubmitting ? 'Saving...' : 'Save project' }}
              </span>
            </button>
            <p v-if="projectError" class="text-xs text-rose-500">
              {{ projectError }}
            </p>
          </form>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70">
          <h2 class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
            Add skill
          </h2>
          <form class="space-y-3 text-sm" @submit.prevent="handleCreateSkill">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                Name
              </label>
              <input
                v-model.trim="skillForm.name"
                type="text"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            <div class="grid gap-3 md:grid-cols-2">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  Category
                </label>
                <input
                  v-model.trim="skillForm.category"
                  type="text"
                  class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Backend, Frontend, Mobile..."
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                  Proficiency (%)
                </label>
                <input
                  v-model.number="skillForm.proficiency"
                  type="number"
                  min="0"
                  max="100"
                  class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-900 dark:text-slate-200">
                Icon label
              </label>
              <input
                v-model.trim="skillForm.icon"
                type="text"
                class="form-control block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-0 transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                placeholder="L, V, F..."
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-indigo-900/40 transition hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              :disabled="skillSubmitting"
            >
              <span
                v-if="skillSubmitting"
                class="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-indigo-200 border-t-transparent"
              ></span>
              <span>
                {{ skillSubmitting ? 'Saving...' : 'Save skill' }}
              </span>
            </button>
            <p v-if="skillError" class="text-xs text-rose-500">
              {{ skillError }}
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const user = ref(null);
const loginForm = reactive({
  email: 'test@example.com',
  password: '',
});
const loginState = ref('idle');
const loginError = ref('');

const projectForm = reactive({
  title: '',
  description: '',
  image: '',
  url: '',
  github_url: '',
  type: 'web',
  technologies: '',
});
const projectSubmitting = ref(false);
const projectError = ref('');

const skillForm = reactive({
  name: '',
  category: '',
  proficiency: 80,
  icon: '',
});
const skillSubmitting = ref(false);
const skillError = ref('');

const userInitials = computed(() => {
  if (!user.value || !user.value.name) {
    return 'AD';
  }

  const parts = user.value.name.split(' ').filter(Boolean);

  if (!parts.length) {
    return 'AD';
  }

  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (
    parts[0].charAt(0).toUpperCase() +
    parts[parts.length - 1].charAt(0).toUpperCase()
  );
});

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
  } catch {
    user.value = null;
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
    } else {
      loginError.value = 'Unexpected response from server.';
    }
  } catch {
    loginError.value = 'Invalid credentials or server error.';
  } finally {
    loginState.value = 'idle';
  }
}

async function handleLogout() {
  try {
    await axios.post('/auth/logout');
  } catch {
  } finally {
    clearToken();
    user.value = null;
  }
}

async function handleCreateProject() {
  projectSubmitting.value = true;
  projectError.value = '';

  const technologies = projectForm.technologies
    ? projectForm.technologies
        .split(',')
        .map(value => value.trim())
        .filter(Boolean)
    : [];

  try {
    await axios.post('/admin/projects', {
      title: projectForm.title,
      description: projectForm.description,
      image: projectForm.image || null,
      url: projectForm.url || null,
      github_url: projectForm.github_url || null,
      type: projectForm.type,
      technologies,
    });

    projectForm.title = '';
    projectForm.description = '';
    projectForm.image = '';
    projectForm.url = '';
    projectForm.github_url = '';
    projectForm.type = 'web';
    projectForm.technologies = '';
  } catch {
    projectError.value =
      'Unable to save project. Check your token or input.';
  } finally {
    projectSubmitting.value = false;
  }
}

async function handleCreateSkill() {
  skillSubmitting.value = true;
  skillError.value = '';

  try {
    await axios.post('/admin/skills', {
      name: skillForm.name,
      category: skillForm.category,
      proficiency: skillForm.proficiency,
      icon: skillForm.icon || null,
    });

    skillForm.name = '';
    skillForm.category = '';
    skillForm.proficiency = 80;
    skillForm.icon = '';
  } catch {
    skillError.value =
      'Unable to save skill. Check your token or input.';
  } finally {
    skillSubmitting.value = false;
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
