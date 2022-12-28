/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
/* eslint-enable import/no-webpack-loader-syntax */
import 'whatwg-fetch';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

bootstrapApplication('web-paas').then((environment) => {
  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
