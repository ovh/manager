import angular from 'angular';

import routing from './delete.routing';

import component from './delete.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciAiTokensDelete';

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
  .service('AiTokenService', service);

export default moduleName;
