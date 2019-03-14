import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import filter from './filter';
import service from './service';
import uniqueVlanIdDirective from './uniqueVlanId.directive';
import validIpAddressDirective from './validIpAddress.directive';
import controller from './controller';
import template from './template.html';

import commonLeftTemplate from './partials/common-left.html';
import commonRightTemplate from './partials/common-right.html';
import descriptionLeftTemplate from './partials/description-left.html';
import subnetsLeftTemplate from './partials/subnets-left.html';
import subnetsRightTemplate from './partials/subnets-right.html';
import vlanLeftTemplate from './partials/vlan-left.html';
import vlanTooltipTemplate from './partials/vlan-tooltip.html';

// import './index.less';
// import './region.less';
// import './menu-item.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructurePrivateNetworkDialog';

angular
  .module(moduleName, [])
  .controller('CloudProjectComputeInfrastructurePrivateNetworkDialogCtrl', controller)
  .filter('CloudProjectComputeInfrastructurePrivateNetworkDialogPrivateNetworkDescription', filter)
  .directive('uniqueVlanId', uniqueVlanIdDirective)
  .directive('validIpAddress', validIpAddressDirective)
  .service('CloudProjectComputeInfrastructurePrivateNetworkDialogService', service)
  .run(/* @ngInject */($templateCache) => {
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/template.html', template);

    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/common-left.html', commonLeftTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/common-right.html', commonRightTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/description-left.html', descriptionLeftTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/subnets-left.html', subnetsLeftTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/subnets-right.html', subnetsRightTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/vlan-left.html', vlanLeftTemplate);
    $templateCache.put('pci/project/compute/infrastructure/privateNetwork/dialog/partials/vlan-tooltip.html', vlanTooltipTemplate);
  });

export default moduleName;
