import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './add.component';

const moduleName = 'ovhManagerPciStoragesContainersContainerObjectAdd';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectStorageContainersContainerObjectAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
