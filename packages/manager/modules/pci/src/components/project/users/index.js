import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import component from './users.component';
import rolesMatrix from './roles-matrix';

const moduleName = 'ovhManagerPciComponentsUsers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    rolesMatrix,
    'ui.router',
  ])
  .component('pciProjectsProjectUsers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
