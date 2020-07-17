import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './roles-matrix.component';

const moduleName = 'ovhManagerPciUsersRolesMatrix';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('pciProjectsProjectUsersMatrix', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
