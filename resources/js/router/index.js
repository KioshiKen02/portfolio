import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const AdminDashboard = () =>
    import('../views/AdminDashboard.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {
                title: 'System Programmer – Melvin Rey C Tambis',
                description:
                    'Portfolio of Melvin Rey C Tambis, System Programmer specializing in PHP Laravel backends, Vue.js frontends, and Flutter mobile applications.',
            },
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard,
            meta: {
                title: 'Admin – Melvin Rey C Tambis',
                description:
                    'Protected admin panel to manage portfolio projects and skills.',
            },
        },
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return {
                ...savedPosition,
                behavior: 'smooth',
            };
        }

        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
            };
        }

        return {
            top: 0,
            behavior: 'smooth',
        };
    },
});

router.afterEach(to => {
    const settings = window.AppConfig?.settings || {};
    const siteTitle = settings.site_title || 'Melvin Rey C Tambis';
    const siteDesc = settings.site_description || 'System Programmer';
    
    // Construct title: "Page Title - Site Name" or just "Site Name - Tagline"
    const pageTitle = to.meta?.title || `${siteTitle} – ${siteDesc}`;
    
    // If dynamic settings exist, override hardcoded meta title logic
    if (settings.site_title && to.meta?.title && to.meta.title.includes('Melvin Rey C Tambis')) {
         document.title = to.meta.title.replace('Melvin Rey C Tambis', siteTitle);
    } else {
         document.title = pageTitle;
    }

    const description = document.querySelector(
        'meta[name="description"]'
    );

    if (description) {
        description.setAttribute(
            'content',
            to.meta?.description ||
                `Portfolio of ${settings.site_author || 'Melvin Rey C Tambis'} specializing in ${siteDesc}.`
        );
    }
});

export default router;

