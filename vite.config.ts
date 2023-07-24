import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@static': path.resolve(__dirname, './static'),
            '@game': path.resolve(__dirname, './src/game')
        }
    },
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
