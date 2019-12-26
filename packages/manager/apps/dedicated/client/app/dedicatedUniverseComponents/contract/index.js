import angular from 'angular';
import '@ovh-ux/ng-ovh-http';

import DucUserContractService from './user-contract.service';

const moduleName = 'ducContract';

angular
  .module(moduleName, ['ngOvhHttp'])
  .service('DucUserContractService', DucUserContractService);

export default moduleName;
