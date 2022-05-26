import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import confirmRedeploy from './confirm';

import ipSubnetValidator from './ip-subnet-validator.directive';
import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerNutanixDashboardGeneralInfoRedeploy';

angular
  .module(moduleName, [
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ngUiRouterBreadcrumb',
    'ui.router',
    confirmRedeploy,
  ])
  .config(routing)
  .directive('ipSubnetValidator', ipSubnetValidator)
  .component('nutanixDashboardGeneralInfoRedeployComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
