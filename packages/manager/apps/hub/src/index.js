import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { useShellClient } from '@ovh-ux/shell';

import { buildURL } from '@ovh-ux/ufrontend';
import {
  findAvailableLocale,
  detectUserLocale,
  isTopLevelApplication,
} from '@ovh-ux/manager-config';
import { BILLING_REDIRECTIONS } from './constants';

import { getShellClient, setShellClient } from './shell';
import TRACKING from './components/at-internet/at-internet.constant';
// test

if (isTopLevelApplication()) {
  import('@ovh-ux/manager-preloader')
    .then(({ attach }) => attach(findAvailableLocale(detectUserLocale())))
    .catch(() => {});
}

useShellClient('hub')
  .then(async (client) => {
    const isSidebarMenuVisible = await client.ux.isMenuSidebarVisible();
    if (!isTopLevelApplication()) {
      client.ux.startProgress();
    }

    setShellClient(client);
    client.ux.setForceAccountSiderBarDisplayOnLargeScreen(true);
    if (!isSidebarMenuVisible) {
      client.ux.showAccountSidebar();
    }

    await client.tracking.setConfig(TRACKING);

    return client.environment.getEnvironment();
  })
  .then((environment) => {
    environment.setVersion(__VERSION__);

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
