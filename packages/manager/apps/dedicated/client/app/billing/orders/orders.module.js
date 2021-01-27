import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import retraction from './retraction/retraction.module';
import ordersService from './billing-orders.service';
import ordersServiceApiv7 from './billing-orders-apiv7.service';

import routing from './orders.routing';

const moduleName = 'ovhManagerBillingOrders';

angular
  .module(moduleName, [
    ngAtInternet,
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    retraction,
    'ui.router',
  ])
  .config(routing)
  .service('BillingOrders', ordersService)
  .service('BillingOrdersApiv7', ordersServiceApiv7)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
