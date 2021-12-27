import angular from 'angular';

import routing from './update.routing';

import component from './update.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciAiTokensUpdate';

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
