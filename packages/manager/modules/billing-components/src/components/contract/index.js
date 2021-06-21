import angular from 'angular';
import '@ovh-ux/ng-ovh-http';

import ContractService from './contract.service';

const moduleName = 'ovhManagerBillingContract';

angular
  .module(moduleName, ['ngOvhHttp'])
  .service('ContractService', ContractService);

export default moduleName;
