import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './allowed-ip.component';

const moduleName = 'ovhManagerPciStoragesDatabasesAllowedIp';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('ovhManagerPciProjectDatabasesAllowedIp', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
