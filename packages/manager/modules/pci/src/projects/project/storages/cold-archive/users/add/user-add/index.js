import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './user-add.component';

const moduleName = 'ovhManagerPciProjectColdArchiveUsersAdd';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .component('pciProjectColdArchiveUsersAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
