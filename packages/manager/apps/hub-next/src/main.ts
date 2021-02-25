import { createApp } from 'vue';
import { attach } from '@ovh-ux/manager-preloader';
import { fetchConfiguration, Environment } from '@ovh-ux/manager-config';
import { setupI18n } from '@/i18n';

// css
import 'bootstrap/dist/css/bootstrap.min.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import router from '@/router';
import App from './App.vue';

fetchConfiguration('hub').then(async () => {
  attach(Environment.getUserLanguage());
  const i18n = setupI18n();

  createApp(App)
    .use(router)
    .use(i18n)
    .mount('#app');
});
