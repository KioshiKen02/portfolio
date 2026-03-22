import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    server: {
        host: process.env.VITE_DEV_HOST || 'localhost',
        port: Number(process.env.VITE_DEV_PORT || 5173),
        strictPort: false,
    },
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,
        }),
        vue(),
        tailwindcss(),
    ],
    test: {
        environment: 'jsdom',
        globals: true,
    },
});
