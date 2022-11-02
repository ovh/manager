import angular from 'angular';

import service from './gateways.service';

const moduleName = 'ovhManagerPciPublicGatewaysService';

angular.module(moduleName, []).service('PciPublicGatewaysService', service);

export default moduleName;
