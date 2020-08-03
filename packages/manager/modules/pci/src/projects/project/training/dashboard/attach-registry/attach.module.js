import angular from 'angular';

import routing from './attach.routing';
import component from './attach.component';

const moduleName = 'ovhManagerPciProjectTrainingDashboardAttachRegistry';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(
    'ovhManagerPciProjectTrainingDashboardAttachRegistryComponent',
    component,
  );

export default moduleName;
