import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete.component';
import routing from './delete.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersDelete';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
