import angular from 'angular';
import angularTranslate from 'angular-translate';
import uiBootstrap from 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './history.component';
import routing from './billing-main-history.routes';

import balance from './balance/billing-history-balance.module';
import debt from './debt/billing-main-history-debt.module';
import legacyHistory from './legacy/history.module';
import postalMailOptions from './postalMailOptions/billing-main-history-postal-mail-options.module';

const moduleName = 'ovhManagerDedicatedBillingHistory';

angular
  .module(moduleName, [
    angularTranslate,
    balance,
    debt,
    legacyHistory,
    ngAtInternet,
    ngOvhApiWrappers,
    ngOvhPaymentMethod,
    'oui',
    'ovh-api-services',
    ovhManagerCore,
    postalMailOptions,
    uiBootstrap,
    uiRouter,
  ])
  .config(routing)
  .component('billingHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
