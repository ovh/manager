import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';
import create from './create';
import addInstances from './add-ip-instance';
import deletion from './delete';
import editName from './edit-name';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembers';

angular
  .module(moduleName, [list, create, addInstances, deletion, editName])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembers', component)
  .service('OctaviaLoadBalancerMembersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
