import angular from 'angular';

import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';
import deleteComponents from '../../components';

const moduleName = 'ovhManagerOctaviaLoadbalancerPoolsDetailDeleteModule';

angular
  .module(moduleName, ['ngUiRouterLayout', deleteComponents])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailDelete', component);

export default moduleName;
