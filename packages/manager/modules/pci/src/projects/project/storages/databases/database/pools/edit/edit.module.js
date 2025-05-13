import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import editComponent from './edit.component';
import routing from './edit.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsEdit';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsEditComponent', editComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
