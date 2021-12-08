import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import poolsComponent from './pools.component';
import routing from './pools.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePools';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsComponent', poolsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
