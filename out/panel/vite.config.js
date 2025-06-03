import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    root: './',
    plugins: [react()],
    build: {
        outDir: 'dist',
        sourcemap: false,
        rollupOptions: {
            input: 'index.html',
            output: {
                entryFileNames: 'assets/main.js',
                assetFileNames: 'assets/[name].[ext]'
            }
        }
    }
});
//# sourceMappingURL=vite.config.js.map