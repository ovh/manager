import angular from 'angular';
import '@ovh-ux/ng-ui-router-layout';

import component from './component';
import routing from './routing';

const moduleName =
  'ovhManagerOctaviaLoadBalancerPoolsDetailHealthMonitorDelete';

angular
  .module(moduleName, ['ngUiRouterLayout'])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailHealthMonitorDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
