import angular from 'angular';

import component from './traffic.component';
import routing from './traffic.routing';
import service from '../network-security.service';

const moduleName = 'ovhNetworkSecurityTraffic';

angular
  .module(moduleName, [])
  .config(routing)
  .service('networkSecurityService', service)
  .component('traffic', component);

export default moduleName;
