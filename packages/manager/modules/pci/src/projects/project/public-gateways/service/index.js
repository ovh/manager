import angular from 'angular';

import service from './public-gateways.service';

const moduleName = 'ovhManagerPciPublicGatewaysService';

angular.module(moduleName, []).service('PciPublicGatewaysService', service);

export default moduleName;
