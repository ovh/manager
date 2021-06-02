import angular from 'angular';
import angularTranslate from 'angular-translate';
import ovhManagerCore from '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import uiRouter from '@uirouter/angularjs';

import details from './details/billing-payments-details.module';
import request from './request/billing-payments-request.module';

import routing from './billing-payments.routes';
import service from './billing-payments.service';

const moduleName = 'ovhManagerBillingMainPayments';

angular
  .module(moduleName, [
    angularTranslate,
    details,
    ngTranslateAsyncLoader,
    'oui',
    ovhManagerCore,
    request,
    uiRouter,
  ])
  .config(routing)
  .service('BillingPayments', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
