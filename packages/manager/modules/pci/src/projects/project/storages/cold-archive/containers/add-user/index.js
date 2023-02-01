import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './add-user.routing';
import component from './add-user.component';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersAddUser';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectStorageColdArchiveContainersAddUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
