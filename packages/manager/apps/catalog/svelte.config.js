import { vitePreprocess } from '@sveltejs/kit/vite'; // eslint-disable-line
import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: 'index.html'
		}),
		alias: {
			$components: 'src/components',
			$assets: 'src/assets',
			$images: 'src/assets/images',
			$models: 'src/models',
			$translations: 'src/translations'
		},
		paths: {
			base: process.env.NODE_ENV === 'development' ? '/app' : '/catalog'
		}
	}
};

export default config;
