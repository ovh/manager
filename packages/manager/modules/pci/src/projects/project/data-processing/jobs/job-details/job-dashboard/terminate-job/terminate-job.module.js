import angular from 'angular';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './terminate-job.component';
import routing from './terminate-job.routing';

const moduleName = 'ovhManagerPciProjectDataProcessingTerminateJobModal';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .component('pciProjectDataProcessingTerminateJobModal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
