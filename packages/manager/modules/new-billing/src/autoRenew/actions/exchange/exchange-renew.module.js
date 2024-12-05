import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import moduleExchange from '@ovh-ux/manager-exchange';

import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular
  .module(moduleName, [
    angularTranslate,
    moduleExchange,
    ngTranslateAsyncLoader,
    uiRouter,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
