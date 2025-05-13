import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesDatabaseNamespacesDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectDatabaseNamespacesDeleteComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
