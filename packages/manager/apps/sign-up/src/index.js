import { bootstrapApplication } from '@ovh-ux/manager-core';

bootstrapApplication('sign-up').then((environment) => {
  environment.setVersion(__VERSION__);

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
