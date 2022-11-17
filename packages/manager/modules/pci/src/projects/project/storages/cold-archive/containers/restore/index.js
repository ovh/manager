import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './restore.component';
import routing from './restore.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersRestore';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersRestore', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
