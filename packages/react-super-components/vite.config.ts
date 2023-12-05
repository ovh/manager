import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'
import tailwindcss from 'tailwindcss'
import { UserConfigExport } from 'vite'
import { name } from './package.json'

const app = async (): Promise<UserConfigExport> => {
    /**
     * Removes everything before the last
     * @octocat/library-repo -> library-repo
     * vite-component-library-template -> vite-component-library-template
     */
    const formattedName = name.match(/[^/]+$/)?.[0] ?? name

    return defineConfig({
        plugins: [
            react(),
            dts({
                insertTypesEntry: true,
            }),
        ],
        css: {
            postcss: {
                plugins: [tailwindcss],
            },
        },
        build: {
            lib: {
                entry: path.resolve(__dirname, 'src/lib/index.ts'),
                name: formattedName,
                formats: ['es', 'umd'],
                fileName: (format) => `${formattedName}.${format}.js`,
            },
        },
        test: {
            globals: true,
            environment: 'jsdom',
        },
    })
}
// https://vitejs.dev/config/
export default app
