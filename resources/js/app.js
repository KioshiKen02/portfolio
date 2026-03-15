import './bootstrap';
import '../css/app.css';
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { motionDirective } from './directives/motion';

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

app.directive('motion', motionDirective);

app.mount('#app');
