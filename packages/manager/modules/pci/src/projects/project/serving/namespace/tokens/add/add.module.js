import angular from 'angular';

import routing from './add.routing';
import component from './add.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokensAdd';

angular.module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceTokensAddComponent', component)
  .service('OvhManagerPciServingTokensService', service);

export default moduleName;
