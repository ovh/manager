import angular from 'angular';

import component from './component';
import routing from './routing';

import overview from './overview';
import listeners from './listeners';
import pools from './pools';
import poolsService from './pools/service';

const moduleName = 'ovhManagerOctaviaLoadBalancerDashboard';

angular
  .module(moduleName, [overview, listeners, pools])
  .config(routing)
  .component('octaviaLoadBalancer', component)
  .service('OctaviaLoadBalancerPoolsService', poolsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
