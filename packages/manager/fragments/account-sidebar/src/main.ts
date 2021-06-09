import { createApp, ref } from 'vue';
import registerFragment from '@ovh-ux/ufrontend/fragment';
import { setupI18n } from '@/i18n';
import AccountSidebar from '@/components/AccountSidebar';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

registerFragment('account-sidebar').then(
  ({ parent, environment }: { parent: string; environment: any }) => {
    const i18n = setupI18n(environment.getUserLocale());
    console.log(environment);
    const user = ref(environment.user);

    createApp(AccountSidebar)
      .use(i18n)
      .provide('user', user)
      .provide('environment', environment)
      .mount(parent);
  },
);
