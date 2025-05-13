import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import poolsComponent from './pools.component';
import routing from './pools.routing';
import add from './add';
import edit from './edit';
import information from './information';
import terminate from './terminate';

const moduleName = 'ovhManagerPciStoragesDatabasePools';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
    add,
    edit,
    information,
    terminate,
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsComponent', poolsComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
