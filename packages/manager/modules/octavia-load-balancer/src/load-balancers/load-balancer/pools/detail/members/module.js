import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';
import deletion from './delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembers';

angular
  .module(moduleName, [list, deletion])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembers', component)
  .service('OctaviaLoadBalancerMembersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
