import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7RulesList';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerL7RulesList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
