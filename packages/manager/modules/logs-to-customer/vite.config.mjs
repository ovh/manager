import { defineConfig } from 'vitest/config';
import dts from 'vite-plugin-dts';
import path from 'path';
import tailwindcss from 'tailwindcss';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import * as packageJson from './package.json' with { type: 'json' };

const pathSrc = path.resolve(__dirname, 'src');
const pathPublic = path.resolve(__dirname, 'public');
const externalDeps = [
    ...Object.keys(packageJson.default.peerDependencies || {}),
    '@ovhcloud/ods-components/react',
];
const baseConfig = getBaseConfig({
    staticCopyTargets: [
        {
            src: `${pathPublic}/translations`,
            dest: '@ovh-ux/logs-to-customer',
        },
    ],
});

export default defineConfig({
    ...baseConfig,
    resolve: {
        alias: {
            '@/public': pathPublic,
            '@': pathSrc,
        },
    },
    plugins: [
        ...baseConfig.plugins, // This includes the React SWC plugin from manager-vite-config
        dts({
            root: __dirname,
            insertTypesEntry: true,
            outDir: 'dist/types',
        }),
    ],
    css: {
        postcss: {
            plugins: [tailwindcss],
        },
    },
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./src/test-utils/setup-test.ts'],
    },
    build: {
        outDir: path.resolve(__dirname, 'dist'),
        emptyOutDir: true,
        cssCodeSplit: false, // Bundle all CSS into a single file
        lib: {
            entry: path.resolve(pathSrc, 'lib.ts'),
            name: 'LogsToCustomerLib',
            formats: ['esm'],
            fileName: () => 'src/lib.js',
        },
        rollupOptions: {
            external: (id) =>
                externalDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
            output: {
                assetFileNames: (assetInfo) => {
                    // Put CSS at the root of dist (standard pattern)
                    if (assetInfo.name?.endsWith('.css')) {
                        return 'style.css';
                    }
                    return '[name][extname]';
                },
            },
        },
        sourcemap: 'hidden',
    },
});

