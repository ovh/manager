import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './edit-retention.component';
import routing from './edit-retention.routing';

const moduleName = 'ovhManagerPciStoragesColdArchiveContainersEditRetention';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciStoragesColdArchiveContainersEditRetention', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
