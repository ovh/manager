import angular from 'angular';

import routing from './detach.routing';
import component from './detach.component';

import registry from '../registry/registry.module';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfosDetachRegistry';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
  registry,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(moduleName, component);

export default moduleName;
