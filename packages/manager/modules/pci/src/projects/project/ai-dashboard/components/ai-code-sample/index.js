import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './ai-code-sample.component';

const moduleName = 'ovhManagerPciAIDashboardCodeSample';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('aiCodeSample', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
