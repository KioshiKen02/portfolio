import './bootstrap';
import '../css/app.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

function resolveInitialTheme() {
    const stored = window.localStorage.getItem('theme');

    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    if (window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
    }

    return 'light';
}

function applyTheme(theme) {
    const root = document.documentElement;

    if (theme === 'dark') {
        root.classList.add('dark');
    } else {
        root.classList.remove('dark');
    }
}

const initialTheme = resolveInitialTheme();

applyTheme(initialTheme);
window.localStorage.setItem('theme', initialTheme);

const app = createApp(App);

app.use(router);

app.directive('fade-slide-up', {
    mounted(el) {
        el.classList.add(
            'opacity-0',
            'translate-y-4',
            'transition-all',
            'duration-700',
            'ease-out'
        );

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        el.classList.remove('opacity-0', 'translate-y-4');
                        el.classList.add('opacity-100', 'translate-y-0');
                        observer.unobserve(el);
                    }
                });
            },
            {
                threshold: 0.2,
            }
        );

        observer.observe(el);
    },
});

app.mount('#app');
