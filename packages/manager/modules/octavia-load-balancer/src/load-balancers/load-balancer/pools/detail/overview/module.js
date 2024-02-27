import angular from 'angular';

import component from './component';
import routing from './routing';
import editName from './edit-name';

const moduleName = 'ovhManagerOctaviaLoadBalancerPoolsDetailOverview';

angular
  .module(moduleName, [editName])
  .config(routing)
  .component('octaviaLoadBalancerPoolsDetailOverview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
