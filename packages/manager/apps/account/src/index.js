import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!jsurl/lib/jsurl.js'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import 'core-js/stable';
import 'whatwg-fetch';
import 'regenerator-runtime/runtime';

import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import { initShellClient } from '@ovh-ux/shell';

defineApplicationVersion(__VERSION__);

initShellClient('account').then(async (shellClient) => {
  if (!isTopLevelApplication()) {
    shellClient.ux.startProgress();
  }

  shellClient.i18n.onLocaleChange(() => {
    window.top.location.reload();
  });
  shellClient.environment.getEnvironment().then((environment) => {
    environment.setVersion(__VERSION__);
    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: startApplication }) => {
        startApplication(document.body, shellClient);
      });
  });
});
