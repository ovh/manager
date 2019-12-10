import angular from 'angular';

import routing from './add.routing';
import component from './add.component';
import service from '../models.service';
import capabilities from '../../../capabilities.service';

import storageService from '../../../../storages/containers/containers.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsAdd';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceModelsAddComponent', component)
  .service('OvhManagerPciServingModelsService', service)
  .service('OvhManagerPciServingNamespaceModelsAddService', capabilities)
  .service('PciStoragesContainersService', storageService);

export default moduleName;
