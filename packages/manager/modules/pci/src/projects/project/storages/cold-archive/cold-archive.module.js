import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './cold-archive.routing';
import service from './cold-archive.service';
import component from './cold-archive.component';

const moduleName = 'ovhManagerPciProjectsProjectStoragesColdArchive';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectsProjectStoragesColdArchive', component)
  .service('PciStoragesColdArchiveService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
