import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import list from './list';
import create from './create';
import edit from './edit';
import deletion from './delete';

const moduleName = 'ovhManagerOctaviaLoadBalancerListeners';

angular
  .module(moduleName, [list, create, edit, deletion])
  .config(routing)
  .component('octaviaLoadBalancerListeners', component)
  .service('OctaviaLoadBalancerListenersService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
