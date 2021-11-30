import 'regenerator-runtime/runtime';
import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!filesize/lib/filesize.js'; // eslint-disable-line
import 'whatwg-fetch';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';

import { registerApplication } from '@ovh-ux/ufrontend';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';

attachPreloader(findAvailableLocale(detectUserLocale()));

registerApplication('email-domain').then(({ environment }) => {
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
