import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './rename-service.routing';
import component from './rename-service.component';

const moduleName = 'ovhManagerAnthosDashboardRenameService';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('anthosDashboardRenameService', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
