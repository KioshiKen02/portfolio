<template>
  <div class="relative isolate min-h-screen text-slate-900 dark:text-white transition-colors duration-300">
    <div class="pointer-events-none fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-scene" :class="`bg-scene-${sceneIndex}`" :style="{ opacity: 1 - sceneT }"></div>
      <div class="absolute inset-0 bg-scene" :class="`bg-scene-${sceneNextIndex}`" :style="{ opacity: sceneT }"></div>
      <div class="absolute inset-0 bg-scene-noise"></div>
      <div class="absolute inset-0 bg-scene-vignette"></div>
    </div>

    <div
      class="fixed left-1/2 top-6 z-40 w-[min(92vw,640px)] -translate-x-1/2 transition duration-500"
      :class="navVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'"
    >
      <nav class="flex items-center justify-between rounded-full border border-slate-200/60 bg-white/70 px-2 py-2 shadow-lg backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/60">
        <a
          v-for="item in navItems"
          :key="item.id"
          :href="`#${item.id}`"
          class="group relative flex-1 rounded-full px-3 py-2 text-xs font-semibold tracking-wide text-slate-600 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:text-slate-300 text-center"
          :class="activeSection === item.id ? 'text-slate-900 dark:text-white' : 'hover:text-slate-900 dark:hover:text-white'"
          :aria-current="activeSection === item.id ? 'page' : undefined"
        >
          <span class="relative z-10">{{ item.label }}</span>
          <span
            class="absolute inset-0 rounded-full bg-slate-900/5 opacity-0 transition duration-300 dark:bg-white/10"
            :class="activeSection === item.id ? 'opacity-100' : 'group-hover:opacity-100'"
          ></span>
        </a>
      </nav>
    </div>

    <!-- Hero Section -->
    <section ref="heroSection" class="section-hero relative flex min-h-screen items-center overflow-hidden pt-20 pb-16">
      <div class="pointer-events-none absolute inset-0 -z-10 hero-shine"></div>

      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-20 lg:items-center">
          <div class="relative z-20 min-w-0 space-y-8 lg:pr-6" v-motion="{ reveal: { delayMs: 60, y: 18 } }">
            <div
              class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
              <span class="relative flex h-2 w-2">
                <span
                  class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {{ settings.hero_badge_text || 'Available for Hire' }}
            </div>

            <h1 class="max-w-[26ch] text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl xl:text-7xl">
              <RotatingTypewriter
                :phrases="heroPhrases"
                :typing-ms="120"
                :deleting-ms="120"
                :pause-ms="650"
                :start-delay-ms="140"
                :loop="true"
              />
            </h1>
            
            <p class="max-w-xl text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              I'm <strong class="text-slate-900 dark:text-white">{{ heroAuthor }}</strong>, a {{ heroRole }}
              {{ settings.hero_description || 'crafting high-performance Laravel backends, reactive Vue.js interfaces, and cross-platform Flutter apps.' }}
            </p>

            <div class="w-full max-w-xl">
              <div class="flex flex-wrap items-center justify-center gap-3">
                <ResumeDownloadButton :url="resumeDownloadUrl" filename="melvin-rey-c-tambis-resume.pdf" />
                
                <a
                  href="#projects"
                  class="group relative inline-flex items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[var(--radius-button)] bg-[var(--color-brand)] px-4 py-3 text-xs font-semibold text-white shadow-lg transition-all hover:bg-[var(--color-brand-hover)] hover:shadow-xl hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 sm:px-6 sm:py-3.5 sm:text-sm dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  View Selected Work
                  <svg class="hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:inline-flex" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
               
                <a
                  href="#contact"
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-button)] border border-slate-200 bg-white px-4 py-3 text-xs font-semibold text-slate-900 transition-all hover:bg-slate-50 hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 sm:px-6 sm:py-3.5 sm:text-sm dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  Contact Me
                </a>
              </div>
            </div>
          </div>

          <div class="hidden lg:block relative z-0 w-full max-w-lg mx-auto" v-motion="{ reveal: { delayMs: 140, y: 18 }, parallax: { speed: 0.06, max: 18 } }">
            <!-- Background Glow -->
            <div
              class="pointer-events-none absolute -inset-1 -z-10 bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-2xl opacity-20 blur-2xl dark:opacity-30"
              v-motion="{ reveal: false, parallax: { speed: 0.12, max: 28 } }"
            >
            </div>

            <!-- Code Window -->
            <div class="relative rounded-xl bg-slate-900 shadow-2xl ring-1 ring-slate-800 overflow-hidden h-[520px]">
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
              <div class="p-5 h-[calc(520px-52px)] overflow-hidden">
                <CodeTypewriter
                  :text="heroCodeText"
                  :start-delay-ms="450"
                  :min-char-delay-ms="14"
                  :max-char-delay-ms="55"
                  :newline-delay-ms="160"
                  :pause-after-finish-ms="1600"
                  :loop="true"
                  :reserve-space="true"
                />
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
    <section ref="aboutSection" id="about" class="section-block py-16 md:py-20 scroll-mt-28">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-10 md:grid-cols-12 md:items-start">
          <div class="md:col-span-7 space-y-6" v-motion="{ reveal: { delayMs: 80 } }">
            <div>
              <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                {{ settings.about_heading || 'Engineering with purpose.' }}
              </h2>
              <div class="mt-4 space-y-4 text-base leading-relaxed text-slate-600 dark:text-slate-400">
                <p>
                  {{ settings.about_paragraph_1 || "I don't just write code; I solve problems. With a background in Computer Engineering, I approach every project with a focus on efficiency, security, and scalability." }}
                </p>
                <p>
                  {{ settings.about_paragraph_2 || "My expertise spans the entire development lifecycle—from database schema design to frontend state management and mobile app deployment. I build tools that businesses rely on." }}
                </p>
              </div>
            </div>

            <div class="card p-5">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <span class="block text-2xl font-bold text-slate-900 dark:text-white">2+</span>
                  <span class="text-sm font-semibold text-slate-500">Years Experience</span>
                </div>
                <div>
                  <span class="block text-2xl font-bold text-slate-900 dark:text-white">10+</span>
                  <span class="text-sm font-semibold text-slate-500">Projects Delivered</span>
                </div>
              </div>
            </div>

            <ExperienceTimeline
              title="Timeline"
              subtitle="Professional experience and key responsibilities."
              :items="experienceItems"
            />
          </div>

          <div class="md:col-span-5 space-y-6" v-motion="{ reveal: { delayMs: 140 } }">
            <div class="mx-auto w-full max-w-sm">
              <ProfilePicture
              :is-dark="isDarkThemeProxy"
              :alt="`${settings.site_author || 'Profile'} photo`"
              :light-default-src="profilePicture.lightDefault"
              :light-hover-src="profilePicture.lightHover"
              :dark-default-src="profilePicture.darkDefault"
              :dark-hover-src="profilePicture.darkHover"
            />
            </div>

            <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
              <div class="card p-5 hover:-translate-y-0.5">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Backend Systems</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Robust RESTful APIs, complex database relationships, and secure authentication using Laravel.
                </p>
              </div>
              <div class="card p-5 hover:-translate-y-0.5">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Frontend Architecture</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Responsive, accessible, and performant interfaces built with Vue.js and Tailwind CSS.
                </p>
              </div>
              <div class="card p-5 hover:-translate-y-0.5 sm:col-span-2 md:col-span-1">
                <h3 class="text-base font-bold text-slate-900 dark:text-white">Mobile Development</h3>
                <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  Native-feel Android and iOS applications using Flutter's powerful rendering engine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Projects Section -->
    <section ref="projectsSection" id="projects" class="section-block py-24 scroll-mt-28">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="mb-16 md:flex md:items-end md:justify-between" v-motion="{ reveal: { delayMs: 80 } }">
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

          <article
            v-for="(project, idx) in projects"
            :key="project.id"
            class="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-xl focus-within:shadow-xl dark:border-slate-800/70 dark:bg-slate-950/40 backdrop-blur"
            role="button"
            tabindex="0"
            v-motion="{ reveal: { delayMs: 80 + idx * 90, y: 18 } }"
            @click="openProject(project)"
            @keydown.enter.prevent="openProject(project)"
            @keydown.space.prevent="openProject(project)"
          >
            <div class="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
              <ProjectPhotoCarousel :images="project.photo_urls || []" :title="project.title" />
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
                <a v-if="project.url" :href="project.url" target="_blank" @click.stop
                  class="text-sm font-semibold text-slate-900 hover:underline dark:text-white">
                  Live Demo
                </a>
                <a v-if="project.github_url" :href="project.github_url" target="_blank" @click.stop
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
    <section ref="skillsSection" id="skills" class="section-block py-24 scroll-mt-28">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="mb-12" v-motion="{ reveal: { delayMs: 80 } }">
          <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Technical Arsenal
          </h2>
        </div>

        <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <!-- Manual Highlight Cards -->
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-motion="{ reveal: { delayMs: 60 } }">
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
            v-motion="{ reveal: { delayMs: 140 } }">
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
            v-motion="{ reveal: { delayMs: 220 } }">
            <h3 class="font-bold text-slate-900 dark:text-white mb-2">Mobile</h3>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400 list-disc pl-5">
              <li>Flutter</li>
              <li>Dart</li>
              <li>State Management</li>
              <li>Cross-platform Deploy</li>
            </ul>
          </div>
          <div class="rounded-xl bg-white p-6 shadow-sm dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            v-motion="{ reveal: { delayMs: 300 } }">
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

    <!-- Certificates & Seminars Section -->
      <section
        id="certificates"
        ref="certificatesSection"
        class="relative min-h-screen py-24 sm:py-32"
        :class="{ 'opacity-0': sceneIndex < 4, 'opacity-100': sceneIndex >= 4 }"
        style="transition: opacity 800ms ease"
      >
        <div class="mx-auto max-w-7xl px-6 lg:px-8">
          <div class="max-w-2xl">
            <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Certificates / Seminars / Workshops and Trainings
            </h2>
            <p class="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-400">
              Professional qualifications and continuous learning achievements.
            </p>
          </div>

          <div class="mt-16 space-y-12">
            
            <div v-if="loadingCertificates" class="flex justify-center py-10">
              <div class="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-slate-800 dark:border-slate-700 dark:border-t-white"></div>
            </div>
            
            <template v-else>
              <!-- Certifications & Eligibility -->
              <div>
                <button
                @click="certsExpanded = !certsExpanded"
                class="flex w-full items-center justify-between border-b border-slate-200 pb-4 text-left dark:border-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                :aria-expanded="certsExpanded"
                aria-controls="certifications-list"
              >
                <h3 class="text-2xl font-semibold text-slate-900 dark:text-white">
                  Certifications & Eligibility
                </h3>
                <svg
                  class="h-6 w-6 transform text-slate-500 transition-transform duration-300 dark:text-slate-400"
                  :class="certsExpanded ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                v-show="certsExpanded"
                id="certifications-list"
                class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <article
                  v-for="(item, idx) in certifications"
                  :key="'cert-'+idx"
                  class="group flex flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div class="relative w-full">
                    <div class="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        v-if="item.photo"
                        :src="item.photo"
                        :alt="`Certificate for ${item.title}`"
                        loading="lazy"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <svg v-else class="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="max-w-xl mt-4">
                    <h4 class="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                      {{ item.title }}
                    </h4>
                    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <span class="font-medium text-slate-900 dark:text-slate-300">{{ item.issuer }}</span>
                      <span class="mx-2 text-slate-300 dark:text-slate-600">&bull;</span>
                      {{ item.date }}
                    </p>
                  </div>
                  <a
                    v-if="item.photo"
                    :href="item.photo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-full justify-center"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download certificate
                  </a>
                </article>
              </div>
            </div>

            <!-- Seminars, Workshops & Trainings -->
            <div>
              <button
                @click="seminarsExpanded = !seminarsExpanded"
                class="flex w-full items-center justify-between border-b border-slate-200 pb-4 text-left dark:border-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-sm"
                :aria-expanded="seminarsExpanded"
                aria-controls="seminars-list"
              >
                <h3 class="text-2xl font-semibold text-slate-900 dark:text-white">
                  Seminars, Workshops & Trainings
                </h3>
                <svg
                  class="h-6 w-6 transform text-slate-500 transition-transform duration-300 dark:text-slate-400"
                  :class="seminarsExpanded ? 'rotate-180' : ''"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div
                v-show="seminarsExpanded"
                id="seminars-list"
                class="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                <article
                  v-for="(item, idx) in seminars"
                  :key="'sem-'+idx"
                  class="group flex flex-col items-start justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
                >
                  <div class="relative w-full">
                    <div class="flex h-32 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
                      <img
                        v-if="item.photo"
                        :src="item.photo"
                        :alt="`Certificate for ${item.title}`"
                        loading="lazy"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <svg v-else class="h-12 w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <div class="max-w-xl mt-4">
                    <h4 class="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
                      {{ item.title }}
                    </h4>
                    <p class="mt-2 text-sm text-slate-600 dark:text-slate-400">
                      <span class="font-medium text-slate-900 dark:text-slate-300">{{ item.issuer }}</span>
                      <span class="mx-2 text-slate-300 dark:text-slate-600">&bull;</span>
                      {{ item.date }}
                    </p>
                  </div>
                  <a
                    v-if="item.photo"
                    :href="item.photo"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 w-full justify-center"
                  >
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download certificate
                  </a>
                </article>
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>

      <!-- Contact Section -->
    <section ref="contactSection" id="contact" class="section-block py-24 scroll-mt-28">
      <div class="container mx-auto px-6 md:px-12 xl:px-24">
        <div class="grid gap-16 lg:grid-cols-2">
          <div v-motion="{ reveal: { delayMs: 80 } }">
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
              <div class="flex items-start gap-4">
                <div class="rounded-lg bg-slate-100 p-3 text-slate-900 dark:bg-slate-800 dark:text-white">
                  <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 8a6 6 0 01-12 0 6 6 0 0112 0zM2 20a8 8 0 0116 0" />
                  </svg>
                </div>
                <div>
                  <h3 class="font-semibold text-slate-900 dark:text-white">LinkedIn</h3>
                  <a
                    v-if="settings.linkedin_url"
                    :href="settings.linkedin_url"
                    target="_blank"
                    class="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  >
                    {{ String(settings.linkedin_url).replace(/^https?:\/\//, '') }}
                  </a>
                  <div v-else class="text-slate-500 dark:text-slate-500 text-sm">
                    Set linkedin_url in Site Settings
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card p-8" v-motion="{ reveal: { delayMs: 140 } }">
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

    <Transition name="project-modal">
      <div
        v-if="projectModalOpen"
        class="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
        @click.self="closeProjectModal"
      >
        <div class="absolute inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"></div>

        <div
          ref="projectModalEl"
          class="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/70 bg-white/90 shadow-2xl backdrop-blur dark:border-slate-800/70 dark:bg-slate-950/80"
          role="dialog"
          aria-modal="true"
          :aria-label="selectedProject?.title ? `${selectedProject.title} details` : 'Project details'"
          tabindex="-1"
        >
          <div class="flex items-start justify-between gap-6 border-b border-slate-100/70 px-6 py-5 dark:border-slate-800/70">
            <div class="min-w-0">
              <h3 class="truncate text-xl font-bold text-slate-900 dark:text-white">{{ selectedProject?.title }}</h3>
              <p v-if="selectedProject?.type" class="mt-1 text-sm font-medium text-slate-500 dark:text-slate-400">
                {{ String(selectedProject.type).charAt(0).toUpperCase() + String(selectedProject.type).slice(1) }}
              </p>
            </div>
            <button
              type="button"
              class="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
              aria-label="Close"
              @click="closeProjectModal"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="grid gap-8 p-6 lg:grid-cols-5">
            <div class="lg:col-span-3">
              <div v-if="selectedProjectImages.length" class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <button
                  v-for="(img, idx) in selectedProjectImages"
                  :key="`${img}-${idx}`"
                  type="button"
                  class="group relative overflow-hidden rounded-xl border border-slate-200/70 bg-slate-50 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:border-slate-800/70 dark:bg-slate-900/40"
                  @click="openLightbox(idx)"
                >
                  <div class="relative aspect-video">
                    <div class="absolute inset-0 bg-slate-200/70 dark:bg-slate-800/70" :class="galleryLoaded[idx] ? 'opacity-0' : 'opacity-100 animate-pulse'" style="transition: opacity 260ms ease"></div>
                    <img
                      :src="img"
                      :alt="`${selectedProject?.title || 'Project'} - Detailed view ${idx + 1}`"
                      loading="lazy"
                      decoding="async"
                      class="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                      :class="galleryLoaded[idx] ? 'opacity-100' : 'opacity-0'"
                      style="transition-property: opacity, transform"
                      @load="galleryLoaded[idx] = true"
                      @error="galleryLoaded[idx] = true"
                    />
                  </div>
                </button>
              </div>
              <div v-else class="flex h-56 items-center justify-center rounded-xl border border-slate-200/70 bg-slate-50 text-slate-400 dark:border-slate-800/70 dark:bg-slate-900/40">
                <svg class="h-14 w-14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>

            <div class="lg:col-span-2">
              <p class="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {{ selectedProject?.description || 'No description available.' }}
              </p>

              <div v-if="selectedProjectTechnologies.length" class="mt-6">
                <h4 class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tech Stack</h4>
                <div class="mt-3 flex flex-wrap gap-2">
                  <span
                    v-for="tag in selectedProjectTechnologies"
                    :key="tag"
                    class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    {{ tag }}
                  </span>
                </div>
              </div>

              <div class="mt-8 flex flex-wrap gap-3">
                <a
                  v-if="selectedProject?.url"
                  :href="selectedProject.url"
                  target="_blank"
                  class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
                >
                  Open Live Demo
                </a>
                <a
                  v-if="selectedProject?.github_url"
                  :href="selectedProject.github_url"
                  target="_blank"
                  class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
                >
                  View Source Code
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <PhotoLightbox
      :open="lightboxOpen"
      :images="selectedProjectImages"
      :index="lightboxIndex"
      :title="selectedProject?.title || 'Project'"
      @close="lightboxOpen = false"
      @update:index="lightboxIndex = $event"
    />
  </div>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import axios from 'axios';
import ProfilePicture from '../components/ProfilePicture.vue';
import ProjectPhotoCarousel from '../components/ProjectPhotoCarousel.vue';
import PhotoLightbox from '../components/PhotoLightbox.vue';
import ExperienceTimeline from '../components/ExperienceTimeline.vue';
import ResumeDownloadButton from '../components/ResumeDownloadButton.vue';
import CodeTypewriter from '../components/CodeTypewriter.vue';
import RotatingTypewriter from '../components/RotatingTypewriter.vue';
import { useTheme } from '../composables/useTheme';
import { useScrollSpy } from '../composables/useScrollSpy';
import { useContactForm } from '../composables/useContactForm';
import { usePortfolioData } from '../composables/usePortfolioData';

const settings = ref(window.AppConfig?.settings || {});

const { isDarkTheme } = useTheme();
const isDarkThemeProxy = isDarkTheme; // Alias for template compatibility

const heroSection = ref(null);
const aboutSection = ref(null);
const projectsSection = ref(null);
const skillsSection = ref(null);
const certificatesSection = ref(null);
const contactSection = ref(null);

const certsExpanded = ref(true);
const seminarsExpanded = ref(true);

const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'certificates', label: 'Certificates' },
  { id: 'contact', label: 'Contact' },
];

const sections = computed(() => [
    { id: 'hero', ref: heroSection },
    { id: 'about', ref: aboutSection },
    { id: 'projects', ref: projectsSection },
    { id: 'skills', ref: skillsSection },
    { id: 'certificates', ref: certificatesSection },
    { id: 'contact', ref: contactSection },
]);

const {
    activeSection,
    navVisible,
    sceneIndex,
    sceneNextIndex,
    sceneT,
    recalcAnchors,
    updateScrollEffects
} = useScrollSpy(sections);

const {
    projects,
    skills,
    experienceItems,
    certifications,
    seminars,
    loadingProjects,
    loadingSkills,
    loadingTimeline,
    loadingCertificates,
    loadAllData,
    normalizeImageUrl
} = usePortfolioData({
    onProjectsLoaded: () => {
        recalcAnchors();
        updateScrollEffects();
    }
});

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const { form, errors, submitState, handleContactSubmit } = useContactForm();

const profilePicture = computed(() => {
  const lightDefault = settings.value?.profile_picture_light_default || '/logo.svg';
  const lightHover = settings.value?.profile_picture_light_hover || lightDefault;
  const darkDefault = settings.value?.profile_picture_dark_default || lightDefault;
  const darkHover = settings.value?.profile_picture_dark_hover || darkDefault;
  return { lightDefault, lightHover, darkDefault, darkHover };
});

const resumeDownloadUrl = computed(() => settings.value?.resume_url || '/resume/melvin-rey-c-tambis-resume.pdf');
const heroPhrases = computed(() => ([
  'Building scalable digital systems.',
  'Crafting fast Laravel backends.',
  'Designing clean Vue.js interfaces.',
]));
const heroAuthor = computed(() => settings.value?.site_author || 'Melvin Rey C Tambis');
const heroRole = computed(() => settings.value?.site_description || 'System Programmer');
const heroCodeText =
`class MelvinTambis extends SystemProgrammer
{
    public $stack = [
        'Laravel',
        'Vue.js',
        'Flutter'
    ];

    public function handle()
    {
        $this->architectScalableSystems();
        $this->deliverCleanCode();

        return "High Performance";
    }
}`;

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

const projectModalOpen = ref(false);
const selectedProject = ref(null);
const projectModalEl = ref(null);
const galleryLoaded = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
let restoreOverflow = null;
let lastFocused = null;

function lockScroll() {
  if (restoreOverflow) return;
  const docEl = document.documentElement;
  const prev = docEl.style.overflow;
  restoreOverflow = () => {
    docEl.style.overflow = prev;
    restoreOverflow = null;
  };
  docEl.style.overflow = 'hidden';
}

function unlockScroll() {
  if (restoreOverflow) restoreOverflow();
}

function openProject(project) {
  selectedProject.value = project;
  galleryLoaded.value = [];
  lightboxOpen.value = false;
  lightboxIndex.value = 0;
  projectModalOpen.value = true;
}

function closeProjectModal() {
  projectModalOpen.value = false;
}

function openLightbox(idx) {
  lightboxIndex.value = idx;
  lightboxOpen.value = true;
}

const selectedProjectTechnologies = computed(() => {
  if (!selectedProject.value) return [];
  return normalizedTechnologies(selectedProject.value);
});

const selectedProjectImages = computed(() => {
  const p = selectedProject.value;
  if (!p) return [];
  const candidates = [];
  if (Array.isArray(p.images)) candidates.push(...p.images);
  if (Array.isArray(p.gallery)) candidates.push(...p.gallery);
  if (p.image) candidates.push(p.image);
  const normalized = candidates
    .filter(Boolean)
    .map((img) => (typeof img === 'string' ? img : ''))
    .filter(Boolean)
    .map(normalizeImageUrl);
  return Array.from(new Set(normalized));
});

function onProjectModalKeydown(e) {
  if (e.key === 'Escape') closeProjectModal();
}

watch(projectModalOpen, async (open) => {
  if (open) {
    lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    lockScroll();
    await nextTick();
    projectModalEl.value?.focus();
    window.addEventListener('keydown', onProjectModalKeydown, { passive: true });
  } else {
    window.removeEventListener('keydown', onProjectModalKeydown);
    lightboxOpen.value = false;
    unlockScroll();
    await nextTick();
    lastFocused?.focus?.();
    lastFocused = null;
  }
});

onMounted(() => {
  loadAllData();
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onProjectModalKeydown);
  unlockScroll();
});
</script>

<style scoped>
.bg-scene {
  transition: opacity 600ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity;
}

.bg-scene-noise {
  opacity: 0.12;
  mix-blend-mode: overlay;
  background-image:
    radial-gradient(circle at 20% 10%, rgba(255, 255, 255, 0.16) 0, rgba(255, 255, 255, 0) 55%),
    radial-gradient(circle at 90% 30%, rgba(255, 255, 255, 0.10) 0, rgba(255, 255, 255, 0) 60%),
    radial-gradient(circle at 40% 90%, rgba(255, 255, 255, 0.10) 0, rgba(255, 255, 255, 0) 60%);
}

.bg-scene-vignette {
  background: radial-gradient(1200px 700px at 50% 10%, rgba(255, 255, 255, 0) 25%, rgba(2, 6, 23, 0.20) 100%);
  opacity: 0.35;
}

.bg-scene-0 {
  background:
    radial-gradient(1200px 700px at 10% 10%, rgba(99, 102, 241, 0.35) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(1000px 600px at 90% 20%, rgba(16, 185, 129, 0.22) 0%, rgba(255, 255, 255, 0) 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(248, 250, 252, 1) 70%, rgba(255, 255, 255, 1) 100%);
}

.bg-scene-1 {
  background:
    radial-gradient(1000px 700px at 20% 20%, rgba(14, 165, 233, 0.26) 0%, rgba(255, 255, 255, 0) 62%),
    radial-gradient(1000px 700px at 80% 40%, rgba(168, 85, 247, 0.20) 0%, rgba(255, 255, 255, 0) 62%),
    linear-gradient(180deg, rgba(248, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 70%, rgba(248, 250, 252, 1) 100%);
}

.bg-scene-2 {
  background:
    radial-gradient(1100px 700px at 10% 30%, rgba(244, 114, 182, 0.18) 0%, rgba(255, 255, 255, 0) 65%),
    radial-gradient(1200px 800px at 90% 10%, rgba(99, 102, 241, 0.25) 0%, rgba(255, 255, 255, 0) 65%),
    linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(241, 245, 249, 1) 70%, rgba(255, 255, 255, 1) 100%);
}

.bg-scene-3 {
  background:
    radial-gradient(1000px 700px at 20% 10%, rgba(16, 185, 129, 0.22) 0%, rgba(255, 255, 255, 0) 62%),
    radial-gradient(1200px 800px at 80% 40%, rgba(14, 165, 233, 0.22) 0%, rgba(255, 255, 255, 0) 62%),
    linear-gradient(180deg, rgba(248, 250, 252, 1) 0%, rgba(255, 255, 255, 1) 70%, rgba(248, 250, 252, 1) 100%);
}

.bg-scene-4 {
  background:
    radial-gradient(1000px 700px at 15% 20%, rgba(251, 191, 36, 0.14) 0%, rgba(255, 255, 255, 0) 65%),
    radial-gradient(1200px 800px at 85% 25%, rgba(244, 63, 94, 0.18) 0%, rgba(255, 255, 255, 0) 65%),
    linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(241, 245, 249, 1) 70%, rgba(255, 255, 255, 1) 100%);
}

.dark .bg-scene-vignette {
  background: radial-gradient(1200px 700px at 50% 10%, rgba(2, 6, 23, 0) 20%, rgba(2, 6, 23, 0.85) 100%);
  opacity: 0.75;
}

.dark .bg-scene-0 {
  background:
    radial-gradient(1200px 700px at 10% 10%, rgba(99, 102, 241, 0.24) 0%, rgba(2, 6, 23, 0) 60%),
    radial-gradient(1000px 600px at 90% 20%, rgba(16, 185, 129, 0.16) 0%, rgba(2, 6, 23, 0) 60%),
    linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 1) 100%);
}

.dark .bg-scene-1 {
  background:
    radial-gradient(1000px 700px at 20% 20%, rgba(14, 165, 233, 0.18) 0%, rgba(2, 6, 23, 0) 62%),
    radial-gradient(1000px 700px at 80% 40%, rgba(168, 85, 247, 0.16) 0%, rgba(2, 6, 23, 0) 62%),
    linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 1) 100%);
}

.dark .bg-scene-2 {
  background:
    radial-gradient(1100px 700px at 10% 30%, rgba(244, 114, 182, 0.14) 0%, rgba(2, 6, 23, 0) 65%),
    radial-gradient(1200px 800px at 90% 10%, rgba(99, 102, 241, 0.18) 0%, rgba(2, 6, 23, 0) 65%),
    linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 1) 100%);
}

.dark .bg-scene-3 {
  background:
    radial-gradient(1000px 700px at 20% 10%, rgba(16, 185, 129, 0.16) 0%, rgba(2, 6, 23, 0) 62%),
    radial-gradient(1200px 800px at 80% 40%, rgba(14, 165, 233, 0.16) 0%, rgba(2, 6, 23, 0) 62%),
    linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 1) 100%);
}

.dark .bg-scene-4 {
  background:
    radial-gradient(1000px 700px at 15% 20%, rgba(251, 191, 36, 0.10) 0%, rgba(2, 6, 23, 0) 65%),
    radial-gradient(1200px 800px at 85% 25%, rgba(244, 63, 94, 0.12) 0%, rgba(2, 6, 23, 0) 65%),
    linear-gradient(180deg, rgba(2, 6, 23, 1) 0%, rgba(2, 6, 23, 1) 100%);
}

.section-block {
  position: relative;
}

.section-block::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  z-index: -1;
}

.dark .section-block::before {
  background: rgba(2, 6, 23, 0.35);
}

.section-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(900px 600px at 20% 20%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0) 60%);
  z-index: -1;
}

.dark .section-hero::before {
  background: radial-gradient(900px 600px at 20% 20%, rgba(255, 255, 255, 0.08) 0%, rgba(2, 6, 23, 0) 60%);
}

.hero-shine {
  background:
    radial-gradient(800px 500px at 70% 30%, rgba(99, 102, 241, 0.14) 0%, rgba(255, 255, 255, 0) 60%),
    radial-gradient(800px 500px at 30% 70%, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 60%);
  opacity: 0.9;
}

.project-modal-enter-active,
.project-modal-leave-active {
  transition: opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-modal-enter-from,
.project-modal-leave-to {
  opacity: 0;
}

.project-modal-enter-active [role="dialog"],
.project-modal-leave-active [role="dialog"] {
  transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1), opacity 260ms cubic-bezier(0.22, 1, 0.36, 1);
}

.project-modal-enter-from [role="dialog"] {
  transform: translateY(16px) scale(0.985);
  opacity: 0;
}

.project-modal-leave-to [role="dialog"] {
  transform: translateY(18px) scale(0.985);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .bg-scene,
  .project-modal-enter-active,
  .project-modal-leave-active,
  .project-modal-enter-active [role="dialog"],
  .project-modal-leave-active [role="dialog"] {
    transition: none !important;
  }
}
</style>
