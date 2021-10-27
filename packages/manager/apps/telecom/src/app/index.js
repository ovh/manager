import 'script-loader!jquery'; // eslint-disable-line
import 'whatwg-fetch';
import {
  attach as attachPreloader,
  displayMessage,
} from '@ovh-ux/manager-preloader';
import {
  fetchConfiguration,
  findAvailableLocale,
  detectUserLocale,
} from '@ovh-ux/manager-config';
import { useShellClient } from '@ovh-ux/shell';

attachPreloader(findAvailableLocale(detectUserLocale()));

fetchConfiguration('telecom').then((environment) => {
  environment.setVersion(__VERSION__);

  if (environment.getMessage()) {
    displayMessage(environment.getMessage(), environment.getUserLanguage());
  }

  const shellClient = useShellClient();
  shellClient.routing.init();

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
