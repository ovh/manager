import angular from 'angular';

import component from './component';
import routing from './routing';

import overview from './overview';
import listeners from './listeners';
import pools from './pools';
import poolsService from './pools/service';
import logs from './logs';

const moduleName = 'ovhManagerOctaviaLoadBalancerDashboard';

angular
  .module(moduleName, [overview, listeners, pools, logs])
  .config(routing)
  .component('octaviaLoadBalancer', component)
  .service('OctaviaLoadBalancerPoolsService', poolsService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
