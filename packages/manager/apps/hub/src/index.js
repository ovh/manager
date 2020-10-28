import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { MANAGER_URLS } from '@ovh-ux/manager-core/src/manager-core.constants';
import { Environment } from '@ovh-ux/manager-config';
import { BILLING_REDIRECTIONS } from './constants';

attachPreloader(Environment.getUserLanguage());

bootstrapApplication().then(({ region }) => {
  BILLING_REDIRECTIONS.forEach((redirectionRegex) => {
    const hash = window.location.hash.replace('#', '');
    if (redirectionRegex.test(hash)) {
      window.location.assign(
        `${MANAGER_URLS[region].dedicated}/${window.location.hash}`,
      );
    }
  });

  import(`./config-${region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: true,
      });
    });
});
