import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ng-tail-logs';
import '@ovh-ux/ui-kit';

import component from './order-command.component';

const moduleName = 'ovhManagerPciStoragesDatabasesOrderCommand';

angular
  .module(moduleName, [
    'oui',
    'ngTailLogs',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('databaseOrderCommand', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
