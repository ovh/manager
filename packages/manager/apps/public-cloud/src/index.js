import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';
import { useShellClient } from '@ovh-ux/shell';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';

import { getShellClient, setShellClient } from './shell';

attachPreloader(findAvailableLocale(detectUserLocale()));

useShellClient('public-cloud')
  .then((client) => {
    setShellClient(client);
    return client.environment.getEnvironment();
  })
  .then((environment) => {
    environment.setVersion(__VERSION__);

    if (environment.getMessage()) {
      displayMessage(environment.getMessage(), environment.getUserLanguage());
    }

    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: startApplication }) => {
        startApplication(document.body, getShellClient());
      });
  });
