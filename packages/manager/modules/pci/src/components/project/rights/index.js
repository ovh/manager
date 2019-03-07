import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectRights';

angular
  .module(moduleName, [])
  .service('CloudProjectRightService', service);

export default moduleName;
