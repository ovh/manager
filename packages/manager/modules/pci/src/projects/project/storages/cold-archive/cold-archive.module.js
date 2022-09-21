import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import routing from './cold-archive.routing';
import service from './cold-archive.service';
import component from './cold-archive.component';

const moduleName = 'ovhManagerPciStoragesColdArchive';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('ovhManagerPciProjectStorageColdArchive', component)
  .service('PciStoragesColdArchiveService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
