import angular from 'angular';

import service from './tokens.service';
import component from './tokens.component';
import routing from './tokens.routing';

import add from './add';

const moduleName = 'ovhManagerPciAiTokens';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
    add,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('AiTokenService', service)
  .component(moduleName, component);

export default moduleName;
