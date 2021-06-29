import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import movements from './movements/billing-credits-movements.module';

import routing from './billing-payment-credits.routes';
import service from './billing-credits.service';

const moduleName = 'ovhManagerBillingPaymentCredits';

angular
  .module(moduleName, [
    angularTranslate,
    movements,
    ngOvhUtils,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .service('BillingCredits', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
