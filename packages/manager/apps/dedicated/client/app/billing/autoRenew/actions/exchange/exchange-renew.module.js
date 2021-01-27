import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import moduleExchange from '@ovh-ux/manager-exchange';

import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular
  .module(moduleName, [
    moduleExchange,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
