import angular from 'angular';

import WucOrderCartService from './order-cart.service';

const moduleName = 'WucOrderCartService';

angular
  .module(moduleName, ['ovh-api-services'])
  .service('WucOrderCartService', WucOrderCartService);

export default moduleName;
