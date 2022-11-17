import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './archive.component';
import routing from './archive.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersArchive';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersArchive', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
