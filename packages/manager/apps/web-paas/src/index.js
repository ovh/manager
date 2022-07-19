/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
/* eslint-enable import/no-webpack-loader-syntax */
import 'whatwg-fetch';
import { registerApplication } from '@ovh-ux/ufrontend';

registerApplication('web-paas').then(({ environment }) => {
  environment.setVersion(__VERSION__);

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
