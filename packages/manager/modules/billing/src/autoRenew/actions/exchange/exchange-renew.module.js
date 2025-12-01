import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import exchangeBillingService from './exchangeBilling.service';

import routing from './exchange-renew.routing';

const moduleName = 'ovhManagerBillingAutorenewExchangeRenew';

angular
  .module(moduleName, [angularTranslate, ngTranslateAsyncLoader, uiRouter])
  .config(routing)
  .service('exchangeBillingService', exchangeBillingService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
