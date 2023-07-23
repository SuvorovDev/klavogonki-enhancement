import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        monkey({
            entry: 'src/main.ts',
            userscript: {
                icon: 'https://vitejs.dev/logo.svg',
                namespace: 'npm/vite-plugin-monkey',
                match: ['http://klavogonki.ru/g/*', 'https://klavogonki.ru/g/*'],
                //match: ['https://www.google.com/*'],
                author: 'SuvorovDev'
            }
        })
    ]
});