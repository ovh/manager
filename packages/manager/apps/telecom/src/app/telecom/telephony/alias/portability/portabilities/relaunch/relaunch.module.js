import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import component from './relaunch.component';
import routing from './relaunch.routing';

const moduleName =
  'ovhManagerTelecomTelephonyAliasPortabilityPortabilitiesRelaunch';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    ngUiRouterLayout,
  ])
  .config(routing)
  .component('portabilitiesRelaunch', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
