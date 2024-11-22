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
import deleteContainer from './delete-container';
import flushArchive from './flush-archive';
import manageArchive from './manage-archive';
import editRetention from './edit-retention';

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
    deleteContainer,
    flushArchive,
    manageArchive,
    editRetention,
  ])
  .component('pciProjectStorageColdArchiveContainers', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
