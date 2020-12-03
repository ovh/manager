import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { Environment, UNIVERSES } from '@ovh-ux/manager-config';

attachPreloader(Environment.getUserLanguage());

bootstrapApplication({
  universe: UNIVERSES.WEB_CLOUD,
}).then(({ region }) => {
  import(`./config-${region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: false,
      });
    });
});
