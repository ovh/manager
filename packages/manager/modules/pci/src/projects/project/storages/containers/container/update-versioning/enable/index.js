import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './enable.component';

const moduleName = 'ovhManagerPciStoragesContainersContainerEnableVersioning';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectStorageContainersContainerEnableVersioning', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
