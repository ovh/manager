import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { useShellClient } from '@ovh-ux/shell';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';
import { getShellClient, setShellClient } from './shell';

defineApplicationVersion(__VERSION__);

useShellClient('telecom')
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
