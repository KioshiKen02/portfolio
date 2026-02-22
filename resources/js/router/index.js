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
                title: 'Full-Stack Web & Mobile Developer Portfolio',
                description:
                    'Portfolio website built with Laravel 12 and Vue 3 showcasing full-stack and mobile projects.',
            },
        },
        {
            path: '/admin',
            name: 'admin',
            component: AdminDashboard,
            meta: {
                title: 'Admin – Portfolio Projects and Skills Management',
                description:
                    'Protected admin panel to manage portfolio projects and skills using JWT authentication.',
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
    const defaultTitle =
        'Full-Stack Web & Mobile Developer Portfolio';

    document.title = to.meta?.title || defaultTitle;

    const description = document.querySelector(
        'meta[name="description"]'
    );

    if (description) {
        description.setAttribute(
            'content',
            to.meta?.description ||
                'Portfolio website built with Laravel 12 and Vue 3.'
        );
    }
});

export default router;

