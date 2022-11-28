import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './delete-objects.component';
import routing from './delete-objects.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersDeleteObjects';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersDeleteObjects', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
