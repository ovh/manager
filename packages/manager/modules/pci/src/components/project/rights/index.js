import angular from 'angular';

import service from './services';

const moduleName = 'ovhManagerPciComponentsProject';

angular
  .module(moduleName, [])
  .service('CloudProjectRightService', service);

export default moduleName;
