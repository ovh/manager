import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './ai-pipeline.component';

const moduleName = 'ovhManagerPciAiDashboardAIPipeline';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectAiPipeline', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
