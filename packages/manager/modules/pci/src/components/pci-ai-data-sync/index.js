import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './pci-ai-data-sync.component';

const moduleName = 'ovhManagerPciAiDataSyncComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPciProjectAiDataSync', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
