import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './users-tokens.component';
import routing from './users-tokens.routing';

const moduleName = 'ovhManagerPciAIDashboardUsersTokens';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
  ])
  .config(routing)
  .component('pciProjectAIDashboardUsersTokens', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
