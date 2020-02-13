import angular from 'angular';

import service from './models.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsService';

angular.module(moduleName, [
])
  .service('OvhManagerPciServingModelsService', service);

export default moduleName;
