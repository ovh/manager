import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './import.component';
import routing from './import.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveUserListImport';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ovh-api-services',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveUserListImport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
