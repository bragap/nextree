import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: path.resolve(__dirname, '../../media'),
        emptyOutDir: true,
        sourcemap: false,
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'index.html'),
            },
            output: {
                entryFileNames: `assets/[name].js`,
                assetFileNames: `assets/[name].[ext]`,
            },
        },
    },
});
//# sourceMappingURL=vite.config.js.map