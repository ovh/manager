import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { useShellClient } from '@ovh-ux/shell';

import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';

import { buildURL } from '@ovh-ux/ufrontend';
import { findAvailableLocale, detectUserLocale } from '@ovh-ux/manager-config';
import { BILLING_REDIRECTIONS } from './constants';

import { getShellClient, setShellClient } from './shell';

attachPreloader(findAvailableLocale(detectUserLocale()));

useShellClient('hub')
  .then((client) => {
    setShellClient(client);
    client.ux.disableAccountSidebarToggle();
    client.ux.showAccountSidebar();
    return client.environment.getEnvironment();
  })
  .then((environment) => {
    environment.setVersion(__VERSION__);

    if (environment.getMessage()) {
      displayMessage(environment.getMessage(), environment.getUserLanguage());
    }

    BILLING_REDIRECTIONS.forEach((redirectionRegex) => {
      const hash = window.location.hash.replace('#', '');
      if (redirectionRegex.test(hash)) {
        window.location.assign(
          buildURL(
            environment.getApplicationURL('dedicated'),
            window.location.hash,
          ),
        );
      }
    });

    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: startApplication }) => {
        startApplication(document.body, getShellClient());
      });
  });
