import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete.component';

const moduleName = 'ovhManagerPciTrainingDeleteJobComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPciProjectTrainingDeleteJob', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
