import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './manage-archive.component';
import routing from './manage-archive.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersManageContainer';
angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersManageContainer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
