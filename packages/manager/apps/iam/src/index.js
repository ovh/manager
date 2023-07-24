import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { initShellClient } from '@ovh-ux/shell';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import { getShellClient, setShellClient } from './shell';

defineApplicationVersion(__VERSION__);

initShellClient('iam')
  .then((client) => {
    if (!isTopLevelApplication()) {
      client.ux.startProgress();
    }

    setShellClient(client);
    return client.environment.getEnvironment();
  })
  .then((environment) =>
    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./iam.module'))
      .then(({ default: startApplication }) =>
        startApplication(document.body, getShellClient()),
      ),
  );
