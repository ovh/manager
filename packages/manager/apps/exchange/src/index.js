import 'regenerator-runtime/runtime';
import 'script-loader!filesize/lib/filesize.js'; // eslint-disable-line
import 'script-loader!urijs/src/URI.min.js'; // eslint-disable-line
import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import { bootstrapApplication } from '@ovh-ux/manager-core';

attachPreloader();

bootstrapApplication().then(({ region }) => {
  import(`./config-${region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: false,
      });
    });
});
