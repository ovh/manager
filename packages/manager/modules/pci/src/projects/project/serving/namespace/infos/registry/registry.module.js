import angular from 'angular';
import 'angular-translate';

import service from './registry.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfosRegistry';

angular
  .module(moduleName, [])
  .service('OvhManagerPciServingRegistryService', service);

export default moduleName;
