import angular from 'angular';

import component from './component';
import routing from './routing';

import overview from './overview';
import members from './members';
import healthMonitor from './health-monitor';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetail';

angular
  .module(moduleName, [overview, members, healthMonitor])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
