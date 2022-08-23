import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';
import 'angular-ui-bootstrap';

import deleteContainer from './delete';
import addUser from './addUser';
import object from './object';
import component from './container.component';
import emptyUser from './emptyUser';

const moduleName = 'ovhManagerPciStoragesContainersContainer';

angular
  .module(moduleName, [
    deleteContainer,
    emptyUser,
    addUser,
    object,
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    'ui.bootstrap',
  ])
  .component('pciProjectStorageContainersContainer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
