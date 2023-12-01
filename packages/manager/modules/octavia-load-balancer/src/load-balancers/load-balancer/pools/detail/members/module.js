import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';
import create from './create';
import deletion from './delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembers';

angular
  .module(moduleName, [list, create, deletion])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembers', component)
  .service('OctaviaLoadBalancerMembersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
