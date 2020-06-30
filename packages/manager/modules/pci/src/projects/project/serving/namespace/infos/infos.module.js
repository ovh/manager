import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';

import routing from './infos.routing';

import attachRegistry from './attach-registry';
import detachRegistry from './detach-registry';
import registry from './registry/registry.module';

import component from './infos.component';

const moduleName = 'ovhManagerPciProjectServingNamespaceInfos';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    registry,
    attachRegistry,
    detachRegistry,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component('ovhManagerPciProjectServingNamespaceInfosComponent', component);

export default moduleName;
