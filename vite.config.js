import { defineConfig } from 'vite';

export default defineConfig({
    // BUILD: Settings for when you "package" the app for the real world (npm run build)
    build: {
        // Tells Vite to put the final, ready-to-publish files in a folder named 'dist'
        outDir: 'dist',
        
        rollupOptions: {
            // Tells the bundler that 'index.html' is the front door/entry point of the app
            input: './index.html',
        },
    },

    // SERVER: Settings for your local development (the live-preview server)
    server: {
        fs: {
            // Security: Only allow Vite to serve files from within this project folder
            // (Prevents the server from accidentally accessing other parts of your computer)
            strict: true,
        },
    },
});