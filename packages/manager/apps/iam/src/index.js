import 'whatwg-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { bootstrapApplication } from '@ovh-ux/manager-core';
import { defineApplicationVersion } from '@ovh-ux/request-tagger';

defineApplicationVersion(__VERSION__);

bootstrapApplication('iam').then((environment) =>
  import('./iam.module').then(({ default: startApplication }) =>
    startApplication(document.body, environment),
  ),
);
