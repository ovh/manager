import angular from 'angular';

import routing from './add.routing';
import component from './add.component';
import service from '../tokens.service';

const moduleName = 'ovhManagerPciAiTokensAdd';

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
