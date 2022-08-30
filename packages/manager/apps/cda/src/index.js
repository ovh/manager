import 'babel-polyfill';
import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';

import { bootstrapApplication } from '@ovh-ux/manager-core';

bootstrapApplication('cda').then((environment) => {
  environment.setVersion(__VERSION__);

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
