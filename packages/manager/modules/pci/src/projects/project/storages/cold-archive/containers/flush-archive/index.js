import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './flush-archive.component';
import routing from './flush-archive.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersFlushArchive';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersFlushArchive', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
