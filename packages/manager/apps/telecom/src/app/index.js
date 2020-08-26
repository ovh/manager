import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import { attach as attachPreloader } from '@ovh-ux/manager-preloader';
import registerApplication from '@ovh-ux/ufrontend/application';
import { Environment } from '@ovh-ux/manager-config';

attachPreloader(Environment.getUserLanguage());

registerApplication('telecom').then(({ config }) => {
  import(`./config-${config.region}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: application }) => {
      angular.bootstrap(document.body, [application], {
        strictDi: false,
      });
    });
});
