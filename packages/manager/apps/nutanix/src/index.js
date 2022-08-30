import 'script-loader!jquery'; // eslint-disable-line
import 'core-js/stable';
import 'whatwg-fetch';
import { bootstrapApplication } from '@ovh-ux/manager-core';

bootstrapApplication('nutanix').then((environment) => {
  environment.setVersion(__VERSION__);

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
