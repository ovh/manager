import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';

import controller from './billing-refunds.controller';
import service from './billing-refunds.service';
import routing from './billing-payment-refunds.routes';

const moduleName = 'ovhManagerBillingRefunds';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    uiRouter,
  ])
  .config(routing)
  .controller('BillingRefundsController', controller)
  .service('BillingRefunds', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
