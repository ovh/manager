import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'angular-ui-bootstrap';

import component from './containers.component';
import routing from './containers.routing';

import deleteContainer from './delete';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersList';

angular
  .module(moduleName, [
    deleteContainer,
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .component('pciProjectStorageColdArchiveContainers', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
