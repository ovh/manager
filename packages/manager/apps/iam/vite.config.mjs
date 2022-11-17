import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';

export default defineConfig(getBaseConfig({ host: 'www.build-ovh.com' }));
