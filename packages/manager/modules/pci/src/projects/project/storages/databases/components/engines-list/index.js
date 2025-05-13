import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './engines-list.component';

const moduleName = 'ovhManagerPciStoragesDatabasesEnginesList';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('databaseEnginesList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
