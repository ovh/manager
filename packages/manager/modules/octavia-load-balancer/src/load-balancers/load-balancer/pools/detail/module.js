import angular from 'angular';

import component from './component';
import routing from './routing';

import overview from './overview';
import members from './members';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetail';

angular
  .module(moduleName, [overview, members])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetail', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
