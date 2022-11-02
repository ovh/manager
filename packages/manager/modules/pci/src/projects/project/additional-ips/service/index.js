import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciPublicIpService';

angular
  .module(moduleName, [])
  .service('PciProjectAdditionalIpService', service);

export default moduleName;
