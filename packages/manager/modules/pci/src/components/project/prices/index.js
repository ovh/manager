import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectPrices';

angular
  .module(moduleName, [])
  .service('OvhCloudPriceHelper', service);

export default moduleName;
