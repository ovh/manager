import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import component from './terminate.component';
import routing from './terminate.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsTerminate';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsAddEditComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
