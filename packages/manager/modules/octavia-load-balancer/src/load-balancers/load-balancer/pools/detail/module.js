import angular from 'angular';

import component from './component';
import routing from './routing';
import overview from './overview';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetail';

angular
  .module(moduleName, [overview])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
