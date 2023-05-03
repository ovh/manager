import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { useShellClient } from '@ovh-ux/shell';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

useShellClient('iam')
  .then(async (client) => {
    if (!isTopLevelApplication()) {
      client.ux.startProgress();
    }
    const environment = await client.environment.getEnvironment();
    return {
      environment,
      client,
    };
  })
  .then(({ environment, client }) =>
    import(`./config-${environment.getRegion()}`)
      .catch(() => {})
      .then(() => import('./iam.module'))
      .then(({ default: startApplication }) =>
        startApplication(document.body, client),
      ),
  );
