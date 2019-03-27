import angular from 'angular';
import '@uirouter/angularjs';
import 'ovh-api-services';

import deploy from './deploy';
import view from './view';

const moduleName = 'ovhManagerPciProjectComputeInfrastructureIac';

angular
  .module(moduleName, [
    deploy,
    view,
  ]);

export default moduleName;
