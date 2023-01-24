import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './ai-guide.component';

const moduleName = 'ovhManagerPciAiDashboardAiGuide';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciAiDashboardAiGuide', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
