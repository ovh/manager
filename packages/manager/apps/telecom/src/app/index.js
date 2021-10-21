import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';
import { client as shellClient } from '@ovh-ux/shell';

attachPreloader(findAvailableLocale(detectUserLocale()));

shellClient.init('telecom').then(({ environment, shell }) => {
  environment.setVersion(__VERSION__);

  if (environment.getMessage()) {
    displayMessage(environment.getMessage(), environment.getUserLanguage());
  }

  shell.routing.init();

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
