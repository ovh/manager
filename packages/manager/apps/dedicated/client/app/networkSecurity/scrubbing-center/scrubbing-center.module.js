import angular from 'angular';

import component from './scrubbing-center.component';
import routing from './scrubbing-center.routing';

const moduleName = 'ovhNetworkSecurityScrubbingCenter';

angular
  .module(moduleName, [])
  .config(routing)
  .component('scrubbingCenter', component);

export default moduleName;
