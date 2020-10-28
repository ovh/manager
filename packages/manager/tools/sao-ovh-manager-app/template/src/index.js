import 'script-loader!jquery'; // eslint-disable-line
import 'core-js/stable'
import 'whatwg-fetch';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { Environment } from '@ovh-ux/manager-config';

attachPreloader(Environment.getUserLanguage());

bootstrapApplication().then(({ region }) => {
  import(`./config-${region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: true,
      });
    });
});
