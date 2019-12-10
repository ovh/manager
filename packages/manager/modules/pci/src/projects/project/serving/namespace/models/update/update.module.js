import angular from 'angular';

import routing from './update.routing';

import component from './update.component';
import service from '../models.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsUpdate';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceModelsUpdateComponent', component)
  .service('OvhManagerPciServingModelsService', service);

export default moduleName;
