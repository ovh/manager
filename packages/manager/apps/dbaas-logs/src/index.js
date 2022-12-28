import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

bootstrapApplication('dbaas-logs').then((environment) => {
  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
