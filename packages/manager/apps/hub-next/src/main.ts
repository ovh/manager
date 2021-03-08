import { createApp } from 'vue';
import { attach } from '@ovh-ux/manager-preloader';
import { Environment } from '@ovh-ux/manager-config';
import registerApplication from '@ovh-ux/ufrontend/application';
import { setupI18n } from '@/i18n';

// css
import 'bootstrap/dist/css/bootstrap.min.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import router from '@/router';
import App from './App.vue';

registerApplication('hub').then(() => {
  attach(Environment.getUserLanguage());
  const i18n = setupI18n(Environment.getUserLocale());

  const app = createApp(App)
    .use(router)
    .use(i18n);

  app.mount('#app');
});
