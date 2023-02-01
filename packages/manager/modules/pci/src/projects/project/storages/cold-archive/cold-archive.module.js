import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './cold-archive.routing';
import service from './cold-archive.service';
import component from './cold-archive.component';

import coldArchiveOnboarding from './onboarding';
import coldArchiveAdd from './add';
import users from './users';
import containers from './containers';

const moduleName = 'ovhManagerPciProjectsProjectStoragesColdArchive';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    coldArchiveOnboarding,
    coldArchiveAdd,
    containers,
    users,
  ])
  .config(routing)
  .component('pciProjectStorageColdArchive', component)
  .service('PciStoragesColdArchiveService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
