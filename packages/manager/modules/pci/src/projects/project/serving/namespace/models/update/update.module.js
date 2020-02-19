import angular from 'angular';

import routing from './update.routing';

import component from './update.component';
import service from '../service/models.module';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsUpdate';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
  service,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceModelsUpdateComponent', component);

export default moduleName;
