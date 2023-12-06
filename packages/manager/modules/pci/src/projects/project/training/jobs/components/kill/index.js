import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './kill.component';

const moduleName = 'ovhManagerPciTrainingKillJobComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPciProjectJobsKillJob', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
