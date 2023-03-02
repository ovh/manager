import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './ai-code-sample.component';

const moduleName = 'ovhManagerPciAiDashboardCodeSample';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectAiCodeSample', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
