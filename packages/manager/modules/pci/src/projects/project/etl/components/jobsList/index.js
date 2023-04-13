import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './workflow-jobs-list.component';

const moduleName = 'ovhManagerPciEtlWorkflowJobsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectWorkflowJobsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
