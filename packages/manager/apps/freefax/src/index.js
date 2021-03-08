import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import registerApplication from '@ovh-ux/ufrontend/application';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';

attachPreloader(findAvailableLocale(detectUserLocale()));

registerApplication('freefax').then(({ environment }) => {
  environment.setVersion(__VERSION__);
  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
