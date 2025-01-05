import angular from 'angular';
import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './component';
import ipSubnetValidator from '../../directive/ip-subnet-validator.directive';
import uniqueIpValidator from '../../directive/unique-ip-validator.directive';

const moduleName = 'ovhManagerNutanixInstallNodeModal';

angular
  .module(moduleName, [
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .component('installNutanixNodeModal', component)
  .directive('nutanixDashboardRedeployIpSubnetValidator', ipSubnetValidator)
  .directive('nutanixDashboardRedeployUniqueIpValidator', uniqueIpValidator)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
