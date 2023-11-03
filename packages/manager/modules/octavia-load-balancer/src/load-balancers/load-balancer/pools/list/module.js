import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsList';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
