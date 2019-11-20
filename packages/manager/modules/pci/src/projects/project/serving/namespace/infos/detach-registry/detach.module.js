import angular from 'angular';

import routing from './detach.routing';
import component from './detach.component';
import service from '../registry.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfosDetachRegistry';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceInfosDetachRegistryComponent', component)
  .service('OvhManagerPciServingRegistryService', service);

export default moduleName;
