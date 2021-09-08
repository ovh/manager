import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';

import registerApplication from '@ovh-ux/ufrontend/application';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';

attachPreloader(findAvailableLocale(detectUserLocale()));

registerApplication('overthebox').then(({ environment }) => {
  environment.setVersion(__VERSION__);

  if (environment.getMessage()) {
    displayMessage(environment.getMessage(), environment.getUserLanguage());
  }

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
