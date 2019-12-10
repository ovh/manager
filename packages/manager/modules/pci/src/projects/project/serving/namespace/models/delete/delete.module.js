import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';
import service from '../models.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsDelete';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceModelsDeleteComponent', component)
  .service('OvhManagerPciServingModelsService', service);

export default moduleName;
