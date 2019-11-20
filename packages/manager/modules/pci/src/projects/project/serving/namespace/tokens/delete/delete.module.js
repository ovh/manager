import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokensDelete';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceTokensDeleteComponent', component)
  .service('OvhManagerPciServingTokensService', service);


export default moduleName;
