import angular from 'angular';

import routing from './add.routing';
import component from './add.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokensAdd';

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
