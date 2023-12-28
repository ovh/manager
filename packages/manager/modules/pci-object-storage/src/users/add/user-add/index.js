import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './user-add.component';

const moduleName = 'ovhManagerPciUsersAddComponent';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectObjectStorageUsersAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
