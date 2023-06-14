import 'script-loader!jquery'; // eslint-disable-line
import 'core-js/stable';
import 'whatwg-fetch';
import 'regenerator-runtime/runtime';

import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

import { useShellClient } from '@ovh-ux/shell';

defineApplicationVersion(__VERSION__);

useShellClient('<%= name %>').then((shellClient) => {
  if (!isTopLevelApplication()) {
    shellClient.ux.startProgress();
  }
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
