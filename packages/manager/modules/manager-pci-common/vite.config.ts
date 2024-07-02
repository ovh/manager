import { resolve } from 'path';

import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

export default {
  plugins: [react(), dts()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      fileName: 'index',
      formats: ['es'],
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@ovh-ux/manager-core-api'],
    },
    sourcemap: true,
  },
};
