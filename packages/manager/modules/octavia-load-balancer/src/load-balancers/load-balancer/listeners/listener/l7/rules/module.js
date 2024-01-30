import angular from 'angular';

import component from './component';
import routing from './routing';

import list from './list';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7Rules';

angular
  .module(moduleName, [list])
  .config(routing)
  .component('octaviaLoadBalancerL7Rules', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
