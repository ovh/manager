import angular from 'angular';

import component from './component';
import routing from './routing';

import editName from './edit-name';

const moduleName = 'ovhManagerOctaviaLoadBalancerOverview';

angular
  .module(moduleName, [editName])
  .config(routing)
  .component('octaviaLoadBalancerOverview', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
