import angular from 'angular';

import service from './service';

const moduleName = 'ovhManagerPciComponentsProjectAdd';

angular
  .module(moduleName, [])
  .service('CloudProjectAdd', service);

export default moduleName;
