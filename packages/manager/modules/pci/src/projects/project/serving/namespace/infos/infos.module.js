import angular from 'angular';
import 'angular-translate';

import routing from './infos.routing';

import attachRegistry from './attach-registry';
import detachRegistry from './detach-registry';

import component from './infos.component';
import service from './registry.service';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfos';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
  attachRegistry,
  detachRegistry,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceInfosComponent', component)
  .service('OvhManagerPciServingRegistryService', service);


export default moduleName;
