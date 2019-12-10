import angular from 'angular';

import service from './tokens.service';
import component from './tokens.component';
import routing from './tokens.routing';

import add from './add';
import deleteModule from './delete';
import update from './update';

const moduleName = 'ovhManagerPciProjectServingNamespaceTokens';

angular.module(moduleName, [
  'ngTranslateAsyncLoader',
  'oui',
  'ovh-api-services',
  'pascalprecht.translate',
  'ui.router',
  add,
  deleteModule,
  update,
])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */)
  .service('OvhManagerPciServingTokenService', service)
  .component('ovhManagerPciProjectServingNamespaceTokensComponent', component);

export default moduleName;
