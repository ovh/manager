import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';
import detail from './detail';
import create from './create';
import edit from './edit';
import deletion from './detail/delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerPools';

angular
  .module(moduleName, [list, detail, create, edit, deletion])
  .config(routing)
  .component('octaviaLoadBalancerPools', component)
  .service('OctaviaLoadBalancerPoolsService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
