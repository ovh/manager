import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerListenersList';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerListenersList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
