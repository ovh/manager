import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
    server: {
        port: 9001,
        hmr: {
            host: 'localhost',
            port: 9001,
        },
		    proxy: {
			      '/api': {
				        target: 'https://www.ovh.com/engine/api',
				        changeOrigin: true,
				        rewrite: (path) => path.replace(/^\/api/, '')
			      },
            '/2api': {
				        target: 'https://www.ovh.com/engine/2api',
				        changeOrigin: true,
				        rewrite: (path) => path.replace(/^\/2api/, '')
			      },
            '/engine/2api': {
				        target: 'https://www.ovh.com/engine/2api',
				        changeOrigin: true,
				        rewrite: (path) => path.replace(/^\/engine\/2api/, '')
			      }
		    }
    },
	  plugins: [sveltekit()],
	  test: {
		    include: ['src/**/*.{test,spec}.{js,ts}']
	  },
		ssr: {
        noExternal: ['lodash-es'],
    },
};

export default config;
