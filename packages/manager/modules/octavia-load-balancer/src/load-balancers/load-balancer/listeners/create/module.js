import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerListenersCreate';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerListenersCreate', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
