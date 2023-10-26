import angular from 'angular';

import component from './component';
import routing from './routing';
import service from './service';

import editName from './edit-name';

const moduleName = 'ovhManagerOctaviaLoadBalancerOverview';

angular
  .module(moduleName, [editName])
  .config(routing)
  .component('octaviaLoadBalancerOverview', component)
  .service('OctaviaLoadBalancerOverviewService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
