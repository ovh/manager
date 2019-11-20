import angular from 'angular';

import service from './models.service';
import component from './models.component';
import routing from './models.routing';

import add from './add';
import deleteModule from './delete';
import update from './update';

const moduleName = 'ovhManagerPciProjectServingNamespaceModels';

angular.module(moduleName, [
  add,
  deleteModule,
  update,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('OvhManagerPciServingModelsService', service)
  .component('ovhManagerPciProjectServingNamespaceModelsComponent', component);

export default moduleName;
