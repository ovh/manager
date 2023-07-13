import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './jobs-list.component';

const moduleName = 'ovhManagerPciDataIntegrationJobsList';

angular
  .module(moduleName, [
    'oui',
    'ngOvhCloudUniverseComponents',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectDataIntegrationJobsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
