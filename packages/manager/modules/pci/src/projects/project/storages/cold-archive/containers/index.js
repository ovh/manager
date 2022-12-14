import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import component from './containers.component';
import routing from './containers.routing';

import addUser from './add-user';
import archiveContainer from './archive';
import restoreContainer from './restore';
import deleteContainerObjects from './delete-objects';
import deleteContainer from './delete-container';
import deleteArchive from './delete-archive';
import manageArchive from './manage-archive';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersList';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
    addUser,
    archiveContainer,
    restoreContainer,
    deleteContainerObjects,
    deleteContainer,
    deleteArchive,
    manageArchive,
  ])
  .component('pciProjectStorageColdArchiveContainers', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
