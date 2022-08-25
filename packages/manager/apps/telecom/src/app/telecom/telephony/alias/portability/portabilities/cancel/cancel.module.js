import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';

import component from './cancel.component';
import routing from './cancel.routing';

const moduleName =
  'ovhManagerTelecomTelephonyAliasPortabilityPortabilitiesCancel';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    ngUiRouterLayout,
  ])
  .config(routing)
  .component('portabilitiesCancel', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
