/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
/* eslint-enable import/no-webpack-loader-syntax */
import 'whatwg-fetch';
import { bootstrapApplication } from '@ovh-ux/manager-core';

bootstrapApplication('web-paas').then((environment) => {
  environment.setVersion(__VERSION__);

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
