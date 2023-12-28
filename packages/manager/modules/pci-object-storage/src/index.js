import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import objects from './objects';
import users from './users';
import component from './object-storage.component';

import routing from './object-storage.routing';
import service from './object-storage.service';

const moduleName = 'ovhManagerPciStoragesObjectStorage';

angular
  .module(moduleName, [
    objects,
    users,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('pciProjectStorageObjectStorage', component)
  .service('PciStoragesObjectStorageService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
