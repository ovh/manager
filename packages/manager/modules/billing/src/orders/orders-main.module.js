import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import billingOrders from './orders/orders.module';
import billingOrdersPurchases from './purchaseOrders';

import routing from './orders-main.routing';

const moduleName = 'ovhManagerBillingOrdersMain';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
    billingOrders,
    billingOrdersPurchases,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
