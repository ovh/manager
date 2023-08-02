import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-job.component';
import routing from './delete-job.routing';

const moduleName = 'ovhManagerPciTrainingJobsDeleteJob';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectTrainingJobsDeleteJobComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
