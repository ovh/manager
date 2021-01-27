import angular from 'angular';
import 'angular-translate';
import ovhManagerCore from '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import '@uirouter/angularjs';

import details from './details/billing-payments-details.module';
import request from './request/billing-payments-request.module';

import routing from './billing-payments.routes';
import service from './billing-payments.service';

const moduleName = 'ovhManagerBillingMainPayments';

angular
  .module(moduleName, [
    details,
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    'pascalprecht.translate',
    request,
    'ui.router',
  ])
  .config(routing)
  .service('BillingPayments', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
