import angular from 'angular';

import routing from './update.routing';

import component from './update.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokensUpdate';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceTokensUpdateComponent', component)
  .service('OvhManagerPciServingTokensService', service);


export default moduleName;
