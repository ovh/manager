import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName =
  'ovhManagerOctaviaLoadBalancerPoolsDetailMembersAddIpInstance';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembersAddIpInstance', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
