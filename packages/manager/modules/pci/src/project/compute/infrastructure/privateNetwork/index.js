import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import dialog from './dialog';

import directive from './directive';
import service from './service';

// import './private-network.less';
// import './private-networks.less';

const moduleName = 'ovhManagerPciProjectComputeInfrastructurePrivateNetwork';

angular
  .module(moduleName, [
    dialog,
  ])
  .directive('privateNetworkList', directive)
  .service('CloudProjectComputeInfrastructurePrivateNetworkService', service);

export default moduleName;
