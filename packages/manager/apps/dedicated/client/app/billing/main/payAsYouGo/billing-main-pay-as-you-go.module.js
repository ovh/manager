import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import routing from './billing-main-pay-as-you-go.routes';

const moduleName = 'ovhManagerBillingMainPayAsYouGo';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
