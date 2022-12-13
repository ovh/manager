import { bootstrapApplication } from '@ovh-ux/manager-core';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

bootstrapApplication('sign-up').then((environment) => {
  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
