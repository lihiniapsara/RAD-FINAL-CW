import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [react(), tailwindcss()],
    //root: './frontend', // frontend subfolder එක root ලෙස භාවිතා කරන්න
    server: {
        port: 3000,
        open: true,
        watch: {
            ignored: ['**/DumpStack.log.tmp'],
        },
    },
});