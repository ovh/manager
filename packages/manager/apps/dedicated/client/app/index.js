import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { initShellClient } from '@ovh-ux/shell';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import { getShellClient, setShellClient } from './shell';

defineApplicationVersion(__VERSION__);

initShellClient('dedicated')
  .then((client) => {
    if (!isTopLevelApplication()) {
      client.ux.startProgress();
    }

    setShellClient(client);
    return client.environment.getEnvironment();
  })
  .then((environment) => {
    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./app.module'))
      .then(({ default: startApplication }) => {
        startApplication(document.body, getShellClient());
      });
  });
