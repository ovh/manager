import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import routing from './account.routing';

import alias from './alias/alias.module';

const moduleName = 'ovhManagerEmailProDashboardAccount';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    alias,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
