import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './switch-price.component';

const moduleName = 'ovhManagerPciStoragesDatabasesSwitchPrice';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectsProjectDatabaseSwitchPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
