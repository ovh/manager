import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import retraction from './retraction/retraction.module';
import ordersService from './billing-orders.service';

import routing from './orders.routing';

const moduleName = 'ovhManagerBillingOrders';

angular
  .module(moduleName, [
    angularTranslate,
    ngAtInternet,
    ngTranslateAsyncLoader,
    'oui',
    retraction,
    uiRouter,
  ])
  .config(routing)
  .service('BillingOrders', ordersService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
