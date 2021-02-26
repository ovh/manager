import angular from 'angular';

import OrderCartService from './order-cart.service';

const moduleName = 'ovhManagerOrderCart';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('OrderCartService', OrderCartService);

export default moduleName;
