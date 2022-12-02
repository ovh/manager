import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-archive.component';
import routing from './delete-archive.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersDeleteArchive';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersDeleteArchive', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
