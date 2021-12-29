import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import addComponent from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerPciStoragesDatabasePoolsAdd';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciStoragesDatabasePoolsAddComponent', addComponent)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
