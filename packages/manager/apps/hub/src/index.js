import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { initShellClient } from '@ovh-ux/shell';

import { buildURL } from '@ovh-ux/url-builder';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import { BILLING_REDIRECTIONS } from './constants';
import { getShellClient, setShellClient } from './shell';
import TRACKING from './components/at-internet/at-internet.constant';

defineApplicationVersion(__VERSION__);

initShellClient('hub')
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

    const environment = await client.environment.getEnvironment();
    await client.tracking.setConfig(environment.getRegion(), TRACKING);
    return environment;
  })
  .then((environment) => {
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
