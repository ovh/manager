import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';

// Translations
// TODO : lazy load traductions with the router and delete all these imports
// en
import enDefault from '@/translations/Messages_en_GB.json';
import enPayment from '@/translations/payment-status-tile/Messages_en_GB.json';
import enOrder from '@/translations/order-tracking/Messages_en_GB.json';
import enEnterprise from '@/translations/enterprise-billing-summary/Messages_en_GB.json';
import enCatalog from '@/translations/catalog-items/Messages_en_GB.json';
import enCarousel from '@/translations/carousel/Messages_en_GB.json';
import enBilling from '@/translations/billing-summary/Messages_en_GB.json';
import enProducts from '@/translations/products/Messages_en_GB.json';
import enSupport from '@/translations/support/Messages_en_GB.json';
// fr
import frDefault from '@/translations/Messages_fr_FR.json';
import frPayment from '@/translations/payment-status-tile/Messages_fr_FR.json';
import frOrder from '@/translations/order-tracking/Messages_fr_FR.json';
import frEnterprise from '@/translations/enterprise-billing-summary/Messages_fr_FR.json';
import frCatalog from '@/translations/catalog-items/Messages_fr_FR.json';
import frCarousel from '@/translations/carousel/Messages_fr_FR.json';
import frBilling from '@/translations/billing-summary/Messages_fr_FR.json';
import frProducts from '@/translations/products/Messages_fr_FR.json';
import frSupport from '@/translations/support/Messages_fr_FR.json';

// css
import 'bootstrap/dist/css/bootstrap.min.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import App from './App.vue';
import router from './router';
import store from './store';

const fr = {
  ...frDefault,
  ...frPayment,
  ...frOrder,
  ...frEnterprise,
  ...frCatalog,
  ...frCarousel,
  ...frBilling,
  ...frProducts,
  ...frSupport,
};

const en = {
  ...enDefault,
  ...enPayment,
  ...enOrder,
  ...enEnterprise,
  ...enCatalog,
  ...enCarousel,
  ...enBilling,
  ...enProducts,
  ...enSupport,
};

// TODO : get these automatically from browser later
const locale = 'fr_FR';
const fallbackLocale = 'en_EN';
const i18n = createI18n({
  locale,
  fallbackLocale,
});

i18n.global.setLocaleMessage(locale, fr);
i18n.global.setLocaleMessage(fallbackLocale, en);

createApp(App)
  .use(store)
  .use(router)
  .use(i18n)
  .mount('#app');
