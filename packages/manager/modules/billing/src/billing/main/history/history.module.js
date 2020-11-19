import angular from 'angular';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import '@ovh-ux/ng-ui-router-layout';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ovhManagerCore from '@ovh-ux/manager-core';

import billingHistoryBalanceCtrl from './balance/billing-history-balance.controller';
import billingHistoryBalanceRoute from './balance/billing-history-balance.routes';
import billingMainHostoryDeptRoute from './debt/billing-main-history-debt.routes';
import billingHistoryDebtDetailsCtrl from './debt/details/billing-main-history-debt-details.controller';
import billingHistoryDebtDetailsRoute from './debt/details/billing-main-history-debt-details.routes';
import billingHistoryDebtPayCtrl from './debt/pay/billing-main-history-debt-pay.controller';
import billingHistoryDebtPayRoute from './debt/pay/billing-main-history-debt-pay.routes';
import billingHistoryPostalMailOptionsCtrl from './postalMailOptions/billing-main-history-postal-mail-options.controller';

import component from './history.component';
import routing from './billing-main-history.routes';

import legacyHistory from './legacy/history.module';

const moduleName = 'ovhManagerDedicatedBillingHistory';

angular
  .module(moduleName, [
    ngAtInternet,
    ngOvhApiWrappers,
    ngOvhPaymentMethod,
    'oui',
    'ovh-api-services',
    ovhManagerCore,
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'ngUiRouterLayout',
    legacyHistory,
  ])
  .config(routing)
  .controller('BillingHistoryBalanceCtrl', billingHistoryBalanceCtrl)
  .config(billingHistoryBalanceRoute)
  .config(billingMainHostoryDeptRoute)
  .controller('BillingHistoryDebtDetailsCtrl', billingHistoryDebtDetailsCtrl)
  .config(billingHistoryDebtDetailsRoute)
  .controller('BillingHistoryDebtPayCtrl', billingHistoryDebtPayCtrl)
  .config(billingHistoryDebtPayRoute)
  .controller(
    'BillingHistoryPostalMailOptionsCtrl',
    billingHistoryPostalMailOptionsCtrl,
  )
  .component('billingHistory', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
