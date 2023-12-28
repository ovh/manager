import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './addUser.component';

const moduleName = 'ovhManagerPciStoragesContainersContainerAddUser';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectStorageContainersContainerAddUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
