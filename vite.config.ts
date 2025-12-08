import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    base: './',
    root: path.join(__dirname, 'src/renderer'),
    publicDir: 'public',
    build: {
        outDir: path.join(__dirname, 'dist'),
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: path.join(__dirname, 'src/renderer/index.html'),
                'command-palette': path.join(__dirname, 'src/renderer/command-palette.html'),
            },
        },
    },
    resolve: {
        alias: {
            '@': path.join(__dirname, 'src'),
        },
    },
    server: {
        port: 5173,
    },
});
