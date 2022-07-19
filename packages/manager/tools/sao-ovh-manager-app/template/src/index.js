import 'script-loader!jquery'; // eslint-disable-line
import 'core-js/stable';
import 'whatwg-fetch';
import { registerApplication } from '@ovh-ux/ufrontend';


registerApplication('<%= name %>').then(({ environment }) => {
  environment.setVersion(__VERSION__);

  if (environment.getMessage()) {
    displayMessage(environment.getMessage(), environment.getUserLanguage());
  }

  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
