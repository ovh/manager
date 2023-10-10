import angular from 'angular';

import component from './scrubbing-center.component';
import routing from './scrubbing-center.routing';
import service from './scrubbing-center.service';

const moduleName = 'ovhNetworkSecurityScrubbingCenter';

angular
  .module(moduleName, [])
  .config(routing)
  .service('scrubbingCenterService', service)
  .component('scrubbingCenter', component);

export default moduleName;
