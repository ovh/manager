import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './emptyUser.component';

const moduleName = 'ovhManagerPciStoragesContainersContainerEmptyUser';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectStorageContainersContainerEmptyUser', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
