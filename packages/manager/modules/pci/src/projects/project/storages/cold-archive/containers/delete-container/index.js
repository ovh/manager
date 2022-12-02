import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-container.component';
import routing from './delete-container.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersDeleteContainer';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersDeleteContainer', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
