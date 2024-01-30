import angular from 'angular';

import component from './component';
import routing from './routing';

import list from './list';
import create from './create';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7Rules';

angular
  .module(moduleName, [list, create])
  .config(routing)
  .component('octaviaLoadBalancerL7Rules', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
