import registerFragment from '@ovh-ux/ufrontend/fragment';
import { LANGUAGES } from '@ovh-ux/manager-config';

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCompositionAPI, {h} from '@vue/composition-api'
import { getItems } from './sidebar.service';
import App from './App.vue';
import { UFrontEnd } from './model/UFrontend';
import { setUFrontend } from './composables/ufrontend'

Vue.config.productionTip = false;

Vue.use(VueI18n);
Vue.use(VueCompositionAPI);

registerFragment('sidebar').then(
  ({
    parent,
    ufrontend
  }: {
    parent: HTMLElement;
    ufrontend: UFrontEnd
  }) => {
    setUFrontend(ufrontend);
    const environment = ufrontend.getEnvironment()
    const locale = environment.getUserLocale();
    const fallback = LANGUAGES.fallback
    return Promise.all([
      import(`./translations/Messages_${locale}.json`)
        .then(({ default: translations}) => translations)
        .catch(() => {}),
      import(`./translations/Messages_${fallback}.json`)
        .then(({ default: fallbackTranslations}) => fallbackTranslations)
    ])
      .then(([translations, fallbackTranslations]) => {
        const i18n = new VueI18n({
          locale,
          fallbackLocale: fallback,
          messages: {
            [locale]: translations,
            [fallback]: fallbackTranslations,
          },
        });

        const universe = environment.getUniverse();

        return getItems(universe).then((sidebarConfig) =>
          new Vue({
          i18n,
          render: () =>
              h(App, {
            props: {
              universe,
              config: sidebarConfig,
            }
          }),
        }).$mount(parent));
      });
  },
);
