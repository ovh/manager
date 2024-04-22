import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7PoliciesList';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerL7PoliciesList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
