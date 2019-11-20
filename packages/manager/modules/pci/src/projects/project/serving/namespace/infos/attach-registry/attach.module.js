import angular from 'angular';

import routing from './attach.routing';
import component from './attach.component';
import service from '../registry.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfosAttachRegistry';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceInfosAttachRegistryComponent', component)
  .service('OvhManagerPciServingRegistryService', service);

export default moduleName;
