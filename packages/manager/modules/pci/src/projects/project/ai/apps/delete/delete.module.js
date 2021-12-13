import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';
import service from '../apps.service';

const moduleName = 'ovhManagerPciAiAppsDelete';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .component(moduleName, component)
  .service('AiAppService', service);

export default moduleName;
