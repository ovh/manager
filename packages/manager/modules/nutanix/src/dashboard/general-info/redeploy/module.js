import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import confirmRedeploy from './confirm';

import ipSubnetValidator from '../../directive/ip-subnet-validator.directive';
import uniqueIpValidator from '../../directive/unique-ip-validator.directive';
import ipValidator from '../../directive/ip-validator.directive';
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
  .directive('nutanixIpSubnetValidator', ipSubnetValidator)
  .directive('nutanixUniqueIpValidator', uniqueIpValidator)
  .directive('nutanixIpValidator', ipValidator)
  .component('nutanixDashboardGeneralInfoRedeployComponent', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
