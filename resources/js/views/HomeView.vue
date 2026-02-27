<template>
  <div class="bg-white text-slate-900 dark:bg-slate-950 dark:text-white transition-colors duration-300">

    <!-- Hero Section -->
    <section class="relative flex min-h-screen items-center overflow-hidden pt-20 pb-16">
      <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100 via-white to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 opacity-40">
      </div>

      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div class="space-y-8" v-fade-slide-up>
            <div
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              Available for Hire
            </div>

            <h1 class="text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl xl:text-7xl">
              {{ settings.site_title || 'Building scalable' }} <br />
              <span class="text-slate-500 dark:text-slate-400">digital systems.</span>
            </h1>

            <p class="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              I'm <strong class="text-slate-900 dark:text-white">{{ settings.site_author || 'Melvin Rey C Tambis' }}</strong>, a {{ settings.site_description || 'System Programmer' }}
              crafting high-performance Laravel backends, reactive Vue.js interfaces, and cross-platform Flutter apps.
            </p>

            <div class="flex flex-wrap gap-4">
              <button @click="scrollToSection('projects')"
                class="group relative inline-flex items-center justify-center overflow-hidden rounded-[var(--radius-button)] bg-[var(--color-brand)] px-8 py-4 font-medium text-white shadow-lg transition-all hover:bg-[var(--color-brand-hover)] hover:shadow-xl hover:-translate-y-0.5 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200">
                View Selected Work
                <svg class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button @click="scrollToSection('contact')"
                class="inline-flex items-center justify-center rounded-[var(--radius-button)] border border-slate-200 bg-white px-8 py-4 font-medium text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900">
                Contact Me
              </button>
            </div>
          </div>

          <div class="hidden lg:block relative w-full max-w-lg mx-auto" v-fade-slide-up>
            <!-- Background Glow -->
            <div
              class="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 blur-2xl dark:opacity-30">
            </div>

            <!-- Code Window -->
            <div class="relative rounded-xl bg-slate-900 shadow-2xl ring-1 ring-slate-800 overflow-hidden">
              <!-- Window Header -->
              <div class="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                <div class="flex gap-1.5">
                  <div class="h-3 w-3 rounded-full bg-rose-500"></div>
                  <div class="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div class="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
                <div class="flex-1 text-center pr-10">
                  <div
                    class="inline-block px-3 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-slate-400">
                    Developer.php
                  </div>
                </div>
              </div>

              <!-- Code Content -->
              <div class="p-5 overflow-x-auto">
                <pre class="font-mono text-sm leading-relaxed">
<span class="text-pink-400">class</span> <span class="text-yellow-200">MelvinTambis</span> <span class="text-pink-400">extends</span> <span class="text-indigo-300">SystemProgrammer</span>
<span class="text-slate-500">{</span>
    <span class="text-pink-400">public</span> <span class="text-indigo-300">$stack</span> <span class="text-slate-500">=</span> <span class="text-slate-500">[</span>
        <span class="text-emerald-300">'Laravel'</span><span class="text-slate-500">,</span>
        <span class="text-emerald-300">'Vue.js'</span><span class="text-slate-500">,</span>
        <span class="text-emerald-300">'Flutter'</span>
    <span class="text-slate-500">];</span>

    <span class="text-pink-400">public</span> <span class="text-pink-400">function</span> <span class="text-blue-300">handle</span><span class="text-slate-500">()</span>
    <span class="text-slate-500">{</span>
        <span class="text-purple-300">$this</span><span class="text-slate-500">-></span><span class="text-blue-300">architectScalableSystems</span><span class="text-slate-500">();</span>
        <span class="text-purple-300">$this</span><span class="text-slate-500">-></span><span class="text-blue-300">deliverCleanCode</span><span class="text-slate-500">();</span>
        
        <span class="text-pink-400">return</span> <span class="text-emerald-300">"High Performance"</span><span class="text-slate-500">;</span>
    <span class="text-slate-500">}</span>
<span class="text-slate-500">}</span></pre>
              </div>
            </div>

            <!-- Floating Badge -->
            <div
              class="absolute -bottom-6 -right-6 rounded-xl bg-white p-4 shadow-xl border border-slate-100 dark:bg-slate-800 dark:border-slate-700 animate-float">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center h-10 w-10 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">Status</div>
                  <div class="text-sm font-bold text-slate-900 dark:text-white">Open to Work</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-16 md:grid-cols-2">
          <div v-fade-slide-up>
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Engineering with purpose.
            </h2>
            <div class="mt-6 space-y-6 text-lg text-slate-600 dark:text-slate-400">
              <p>
                I don't just write code; I solve problems. With a background in Computer Engineering, I approach every
                project with a focus on efficiency, security, and scalability.
              </p>
              <p>
                My expertise spans the entire development lifecycle—from database schema design to frontend state
                management and mobile app deployment. I build tools that businesses rely on.
              </p>
            </div>

            <div class="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
              <div class="grid grid-cols-2 gap-8">
                <div>
                  <span class="block text-3xl font-bold text-slate-900 dark:text-white">2+</span>
                  <span class="text-sm font-medium text-slate-500">Years Experience</span>
                </div>
                <div>
                  <span class="block text-3xl font-bold text-slate-900 dark:text-white">10+</span>
                  <span class="text-sm font-medium text-slate-500">Projects Delivered</span>
                </div>
              </div>
            </div>
          </div>

          <div class="grid gap-6" v-fade-slide-up>
            <div
              class="group rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Backend Systems</h3>
              <p class="mt-2 text-slate-600 dark:text-slate-400">
                Robust RESTful APIs, complex database relationships, and secure authentication using Laravel.
              </p>
            </div>
            <div
              class="group rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Frontend Architecture</h3>
              <p class="mt-2 text-slate-600 dark:text-slate-400">
                Responsive, accessible, and performant interfaces built with Vue.js and Tailwind CSS.
              </p>
            </div>
            <div
              class="group rounded-2xl bg-white p-8 shadow-sm transition hover:shadow-md dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
              <h3 class="text-xl font-bold text-slate-900 dark:text-white">Mobile Development</h3>
              <p class="mt-2 text-slate-600 dark:text-slate-400">
                Native-feel Android and iOS applications using Flutter's powerful rendering engine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section id="projects" class="py-24 bg-white dark:bg-slate-950">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="mb-16 md:flex md:items-end md:justify-between" v-fade-slide-up>
          <div class="max-w-xl">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Selected Work</h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">
              A collection of projects highlighting my technical capabilities.
            </p>
          </div>
          <div class="mt-6 md:mt-0 hidden md:block">
            <a href="https://github.com/KioshiKen02" target="_blank"
              class="text-sm font-semibold text-slate-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300 flex items-center gap-2">
              View Github Profile
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3">
                </path>
              </svg>
            </a>
          </div>
        </div>

        <div v-if="loadingProjects" class="flex justify-center py-20">
          <div
            class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white">
          </div>
        </div>

        <div v-else class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div v-if="projects.length === 0"
            class="col-span-full flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl dark:border-slate-800">
            <p class="text-slate-500">No projects to display currently.</p>
          </div>

          <article v-for="project in projects" :key="project.id"
            class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
            v-fade-slide-up>
            <div class="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img v-if="project.image" :src="projectImageUrl(project)" :alt="project.title"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
              <div v-else class="flex h-full items-center justify-center text-slate-400">
                <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="flex flex-1 flex-col p-6">
              <div class="mb-4 flex flex-wrap gap-2">
                <span v-for="tag in normalizedTechnologies(project).slice(0, 3)" :key="tag"
                  class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                  {{ tag }}
                </span>
              </div>

              <h3 class="text-xl font-bold text-slate-900 dark:text-white">
                {{ project.title }}
              </h3>
              <p class="mt-2 flex-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400 line-clamp-3">
                {{ project.description }}
              </p>

              <div class="mt-6 flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <a v-if="project.url" :href="project.url" target="_blank"
                  class="text-sm font-semibold text-slate-900 hover:underline dark:text-white">
                  Live Demo
                </a>
                <a v-if="project.github_url" :href="project.github_url" target="_blank"
                  class="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
                  Source Code
                </a>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Skills Section -->
    <section id="skills" class="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="mb-12" v-fade-slide-up>
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Technical Arsenal
          </h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Manual Highlight Cards -->
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-fade-slide-up>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Backend</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              <li>Laravel Framework</li>
              <li>MySQL / MariaDB</li>
              <li>Redis & Queues</li>
              <li>WebSockets / Reverb</li>
              <li>RESTful APIs</li>
            </ul>
          </div>
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-fade-slide-up>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Frontend</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              <li>Vue.js 3</li>
              <li>Tailwind CSS</li>
              <li>JavaScript</li>
              <li>Vite & Webpack</li>
              <li>Bootstrap</li>
            </ul>
          </div>
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-fade-slide-up>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Mobile</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              <li>Flutter</li>
              <li>Dart</li>
              <li>State Management</li>
              <li>Cross-platform Deploy</li>
            </ul>
          </div>
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-fade-slide-up>
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Tools</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              <li>Git & GitHub</li>
              <li>Postman</li>
              <li>VS Code</li>
              <li>Android Studio</li>
              <li>IIS Manager</li>
            </ul>
          </div>
        </div>

        <!-- Dynamic Skills List -->
        <div class="mt-12 flex flex-wrap gap-3" v-if="skills.length > 0">
          <span v-for="skill in skills" :key="skill.id"
            class="inline-flex items-center rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {{ skill.name }} <span class="ml-2 text-xs opacity-60">{{ skill.proficiency }}%</span>
          </span>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-24 bg-white dark:bg-slate-950">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-16 lg:grid-cols-2">
          <div v-fade-slide-up>
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Let's work together.
            </h2>
            <p class="mt-6 text-lg text-slate-600 dark:text-slate-400">
              Have a project in mind or need a developer to join your team? I'm always open to discussing new
              opportunities.
            </p>

            <div class="mt-10 space-y-6">
              <div class="flex items-start gap-4">
                <div class="rounded-lg bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">Email</h3>
                  <a :href="`mailto:${settings.contact_email || 'official.melvinreytambis@gmail.com'}`"
                    class="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{{ settings.contact_email || 'official.melvinreytambis@gmail.com' }}</a>
                </div>
              </div>
              <div class="flex items-start gap-4">
                <div class="rounded-lg bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-white">
                  <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">GitHub</h3>
                  <a :href="settings.github_url || 'https://github.com/KioshiKen02'" target="_blank"
                    class="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">{{ (settings.github_url || 'github.com/KioshiKen02').replace(/^https?:\/\//, '') }}</a>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-8" v-fade-slide-up>
            <form @submit.prevent="handleContactSubmit" class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                <input v-model.trim="form.name" type="text" id="name"
                  class="input-field mt-1"
                  placeholder="Your Name" />
                <p v-if="errors.name" class="mt-1 text-xs text-rose-500">{{ errors.name }}</p>
              </div>

              <div>
                <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                <input v-model.trim="form.email" type="email" id="email"
                  class="input-field mt-1"
                  placeholder="you@example.com" />
                <p v-if="errors.email" class="mt-1 text-xs text-rose-500">{{ errors.email }}</p>
              </div>

              <div>
                <label for="message"
                  class="block text-sm font-medium text-slate-700 dark:text-slate-300">Message</label>
                <textarea v-model.trim="form.message" id="message" rows="4"
                  class="input-field mt-1 resize-none"
                  placeholder="How can I help you?"></textarea>
                <p v-if="errors.message" class="mt-1 text-xs text-rose-500">{{ errors.message }}</p>
              </div>

              <button type="submit" :disabled="submitState === 'submitting'"
                class="btn-primary w-full">
                <span v-if="submitState === 'submitting'">Sending...</span>
                <span v-else>Send Message</span>
              </button>

              <div v-if="submitState === 'success'"
                class="rounded-lg bg-emerald-50 p-3 text-center text-sm font-medium text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400">
                Message sent successfully!
              </div>
              <div v-if="submitState === 'error'"
                class="rounded-lg bg-rose-50 p-3 text-center text-sm font-medium text-rose-600 dark:bg-rose-900/20 dark:text-rose-400">
                Something went wrong. Please try again.
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';

const projects = ref([]);
const skills = ref([]);
const loadingProjects = ref(false);
const loadingSkills = ref(false);
const settings = ref(window.AppConfig?.settings || {});

const form = reactive({
  name: '',
  email: '',
  subject: '', // Optional subject logic kept for compatibility
  message: '',
});

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitState = ref('idle');

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function normalizedTechnologies(project) {
  if (!project.technologies) return [];
  if (Array.isArray(project.technologies)) return project.technologies;
  try {
    const parsed = JSON.parse(project.technologies);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function validateField(field) {
  const value = form[field] ? form[field].trim() : '';

  if (field === 'name') {
    errors.name = value.length === 0 ? 'Please enter your name.' : '';
  }

  if (field === 'email') {
    if (!value.length) {
      errors.email = 'Please enter your email.';
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
      errors.email = 'Please enter a valid email address.';
    } else {
      errors.email = '';
    }
  }

  if (field === 'message') {
    if (!value.length) {
      errors.message = 'Please include a short message.';
    } else if (value.length > 2000) {
      errors.message = 'Message cannot exceed 2000 characters.';
    } else {
      errors.message = '';
    }
  }
}

function validateForm() {
  validateField('name');
  validateField('email');
  validateField('message');
  return !errors.name && !errors.email && !errors.message;
}

async function handleContactSubmit() {
  if (!validateForm()) {
    submitState.value = 'error';
    return;
  }

  submitState.value = 'submitting';

  try {
    await axios.post('/contact', {
      name: form.name,
      email: form.email,
      subject: form.subject || 'Portfolio Contact', // Default subject if not in form
      message: form.message,
    });

    submitState.value = 'success';
    form.name = '';
    form.email = '';
    form.subject = '';
    form.message = '';

    // Clear errors
    Object.keys(errors).forEach(key => errors[key] = '');

  } catch (error) {
    console.error(error);
    submitState.value = 'error';
  } finally {
    setTimeout(() => {
      if (submitState.value === 'success') {
        submitState.value = 'idle';
      }
    }, 3000);
  }
}

function projectImageUrl(project) {
  if (!project || !project.image) return '';
  return `/images/projects/${project.image}`;
}

async function loadProjects() {
  loadingProjects.value = true;
  try {
    const { data } = await axios.get('/projects');
    projects.value = Array.isArray(data) ? data : [];
  } catch {
    projects.value = [];
  } finally {
    loadingProjects.value = false;
  }
}

async function loadSkills() {
  loadingSkills.value = true;
  try {
    const { data } = await axios.get('/skills');
    skills.value = Array.isArray(data) ? data : [];
  } catch {
    skills.value = [];
  } finally {
    loadingSkills.value = false;
  }
}

onMounted(() => {
  loadProjects();
  loadSkills();
});
</script>

<style scoped>
/* No extra styles needed, utilizing Tailwind CSS exclusively */
</style>