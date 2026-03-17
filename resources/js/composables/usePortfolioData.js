import { ref } from 'vue';
import axios from 'axios';

export function usePortfolioData(callbacks = {}) {
    const projects = ref([]);
    const skills = ref([]);
    const experienceItems = ref([]);
    
    const loadingProjects = ref(false);
    const loadingSkills = ref(false);
    const loadingTimeline = ref(false);

    function normalizeImageUrl(path, size = 'full') {
        if (!path || typeof path !== 'string') return '';
        if (path.startsWith('http')) return path;
        
        // Prepare for future optimization (e.g., Glide, Spatie Media Library)
        return `/images/projects/${path}`;
    }

    function projectPhotoUrls(project, size = 'full') {
        if (!project) return [];
        const candidates = [];
        if (Array.isArray(project.images)) candidates.push(...project.images);
        if (project.image) candidates.push(project.image);
        const normalized = candidates
            .filter(Boolean)
            .map((img) => (typeof img === 'string' ? img : ''))
            .filter(Boolean)
            .map(path => normalizeImageUrl(path, size));
        return Array.from(new Set(normalized));
    }

    function formatExperienceRange(startsAt, endsAt) {
        const start = startsAt ? new Date(startsAt) : null;
        const end = endsAt ? new Date(endsAt) : null;
        const fmt = new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short' });
        const startText = start && !isNaN(start.getTime()) ? fmt.format(start) : '—';
        const endText = end && !isNaN(end.getTime()) ? fmt.format(end) : 'Present';
        return `${startText} — ${endText}`;
    }

    async function loadProjects() {
        loadingProjects.value = true;
        try {
            const { data } = await axios.get('/projects');
            const raw = Array.isArray(data) ? data : [];
            projects.value = raw.map((p) => ({
                ...p,
                photo_urls: projectPhotoUrls(p, 'thumb'),
            }));
        } catch (error) {
            console.error('Failed to load projects:', error);
            projects.value = [];
        } finally {
            loadingProjects.value = false;
            if (callbacks.onProjectsLoaded) {
                // Use requestAnimationFrame to ensure DOM is updated before callback
                requestAnimationFrame(() => {
                    callbacks.onProjectsLoaded();
                });
            }
        }
    }

    async function loadSkills() {
        loadingSkills.value = true;
        try {
            const { data } = await axios.get('/skills');
            skills.value = Array.isArray(data) ? data : [];
        } catch (error) {
            console.error('Failed to load skills:', error);
            skills.value = [];
        } finally {
            loadingSkills.value = false;
        }
    }

    async function loadTimeline() {
        loadingTimeline.value = true;
        try {
            const { data } = await axios.get('/timeline');
            const entries = Array.isArray(data) ? data : [];
            experienceItems.value = entries
                .slice()
                .sort((a, b) => {
                    const ao = Number(a.sort_order || 0);
                    const bo = Number(b.sort_order || 0);
                    if (ao !== bo) return ao - bo;
                    return new Date(b.starts_at).getTime() - new Date(a.starts_at).getTime();
                })
                .map((e) => ({
                    id: e.id,
                    title: e.title,
                    company: e.organization || '',
                    range: formatExperienceRange(e.starts_at, e.ends_at),
                    description: e.description || '',
                    bullets: Array.isArray(e.responsibilities) ? e.responsibilities : [],
                    media_url: e.media_url || '',
                    media_alt: e.media_alt || '',
                }));
        } catch (error) {
            console.error('Failed to load timeline:', error);
            experienceItems.value = [];
        } finally {
            loadingTimeline.value = false;
        }
    }

    function loadAllData() {
        loadProjects();
        loadSkills();
        loadTimeline();
    }

    return {
        projects,
        skills,
        experienceItems,
        loadingProjects,
        loadingSkills,
        loadingTimeline,
        loadProjects,
        loadSkills,
        loadTimeline,
        loadAllData,
        normalizeImageUrl,
        projectPhotoUrls
    };
}
