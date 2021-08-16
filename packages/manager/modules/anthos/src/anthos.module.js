import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import routing from './anthos.routing';
import component from './anthos.component';

const moduleName = 'ovhManagerAnthos';

angular
  .module(moduleName, [
    'ovhManagerCore',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('anthosTenants', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
