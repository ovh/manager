import 'regenerator-runtime/runtime';
import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!filesize/lib/filesize.js'; // eslint-disable-line
import 'whatwg-fetch';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

bootstrapApplication('email-domain').then((environment) => {
  import(`./config-${environment.getRegion()}`)
    .catch(() => {})
    .then(() => import('./app.module'))
    .then(({ default: startApplication }) => {
      startApplication(document.body, environment);
    });
});
