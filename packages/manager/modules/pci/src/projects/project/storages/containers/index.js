import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import component from './containers.component';
import service from './containers.service';
import users from './user-list';
import containerList from './list';

const moduleName = 'ovhManagerPciStoragesContainers';

angular
  .module(moduleName, [
    containerList,
    users,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .component('pciProjectStorageContainers', component)
  .service('PciProjectStorageContainersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
