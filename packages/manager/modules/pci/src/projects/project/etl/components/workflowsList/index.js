import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './workflows-list.component';

const moduleName = 'ovhManagerPciEtlWorkflowsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectWorkflowsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
