import angular from 'angular';

import component from './component';
import routing from './routing';

import overview from './overview';
import listeners from './listeners';
import service from './service';

const moduleName = 'ovhManagerOctaviaLoadBalancerDashboard';

angular
  .module(moduleName, [overview, listeners])
  .config(routing)
  .component('octaviaLoadBalancer', component)
  .service('OctaviaLoadBalancerService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
