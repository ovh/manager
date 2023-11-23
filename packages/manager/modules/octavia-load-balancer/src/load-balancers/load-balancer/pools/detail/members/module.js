import angular from 'angular';

import component from './component';
import routing from './routing';
import list from './list';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembers';

angular
  .module(moduleName, [list])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
