import angular from 'angular';

import component from './scrubbing-center.component';
import routing from './scrubbing-center.routing';
import service from '../network-security.service';

const moduleName = 'ovhNetworkSecurityScrubbingCenter';

angular
  .module(moduleName, [])
  .config(routing)
  .service('networkSecurityService', service)
  .component('scrubbingCenter', component);

export default moduleName;
