import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokensDelete';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(moduleName, component)
  .service('OvhManagerPciServingTokensService', service);

export default moduleName;
