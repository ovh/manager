import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-ui-angular';

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
