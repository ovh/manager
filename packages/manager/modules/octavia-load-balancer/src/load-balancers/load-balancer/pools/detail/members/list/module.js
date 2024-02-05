import angular from 'angular';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailMembersList';

angular
  .module(moduleName, [])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailMembersList', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
