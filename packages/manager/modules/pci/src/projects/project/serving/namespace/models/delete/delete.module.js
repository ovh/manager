import angular from 'angular';
import '@ovh-ux/ng-at-internet';

import routing from './delete.routing';

import component from './delete.component';
import service from '../service/models.module';

const moduleName = 'ovhManagerPciProjectServingNamespaceModelsDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    'ngAtInternet',
    service,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectServingNamespaceModelsDeleteComponent',
    component,
  );

export default moduleName;
