import angular from 'angular';

import routing from './attach.routing';
import component from './attach.component';

import registry from '../registry/registry.module';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfosAttachRegistry';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    registry,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectServingNamespaceInfosAttachRegistryComponent',
    component,
  );

export default moduleName;
