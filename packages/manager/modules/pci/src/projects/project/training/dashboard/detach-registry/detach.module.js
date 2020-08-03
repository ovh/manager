import angular from 'angular';

import routing from './detach.routing';
import component from './detach.component';

const moduleName = 'ovhManagerPciProjectTrainingDashboardDetachRegistry';

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
  .component('ovhManagerPciProjectTrainingDashboardDetachRegistry', component);

export default moduleName;
