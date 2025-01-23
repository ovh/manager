import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhWebUniverseComponents from '@ovh-ux/ng-ovh-web-universe-components';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';
import set from 'lodash/set';
import autorenew from './autoRenew/autorenew.module';
import billingMain from './main/billing-main.module';
import dateRangeSelectionService from './common/dateRangeSelection';
import debtAccount from './dbtAccount/billing-debtAccount.service';
import featureAvailability from './billing-feature-availability';
import history from './main/history/history.module';
import paymentCreditAdd from './payment/credits/add/add-credits.module';
import messageParser from './common/messageParser';
import order from './order/billing-order-tracking.module';
import orders from './orders/orders/orders.module';
import ordersMain from './orders/orders-main.module';
import ordersPurchases from './orders/purchaseOrders/billing-orders-purchases.module';
import ovhAccountRefund from './payment/ovhAccount/refund';
import refunds from './main/refunds/refunds.module';
import sla from './sla/sla.module';
import termination from './confirmTerminate/termination.module';
import userService from './common/User';
import payment from './payment/billing-payment.module';
import paymentMehtod from './payment/method';
import renewHelper from './common/renew-helper.service';

import dateRangeDirective from './components/directives/dateRange/billingDateRange.directive';
import sortingFieldButtonDirective from './components/directives/sortingFieldButton/billingSortingFieldButton';
import renewDateComponent from './components/renewDate/billing-renew-date.component';
import renewLabelComponent from './components/renewLabel/billing-renew-label.component';
import renewFrequenceFilter from './components/filters/renewFrequence';
import servicesHelper from './services/servicesHelper.service';

import routing from './billing.routing';
import billingTracking from './atInternetTracking.config';

import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-feature-flipping';
import 'angular-ui-bootstrap';

const moduleName = 'Billing';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    'ngUiRouterBreadcrumb',
    'oc.lazyLoad',
    'ui.select',
    'ngOvhFeatureFlipping',
    ngOvhWebUniverseComponents,
    ngPaginationFront,
    autorenew,
    billingMain,
    history,
    paymentCreditAdd,
    order,
    ordersMain,
    orders,
    ordersPurchases,
    ovhAccountRefund,
    refunds,
    ovhManagerCore,
    payment,
    paymentMehtod,
    sla,
    termination,
  ])
  .service('billingFeatureAvailability', featureAvailability)
  .service('BillingdateRangeSelection', dateRangeSelectionService)
  .service('BillingDebtAccount', debtAccount)
  .service('BillingmessageParser', messageParser)
  .service('billingRenewHelper', renewHelper)
  .service('BillingUser', userService)
  .service('ServicesHelper', servicesHelper)
  .config(routing)
  .directive('billingDateRange', dateRangeDirective)
  .directive('billingSortingFieldButton', sortingFieldButtonDirective)
  .component(renewDateComponent.name, renewDateComponent)
  .component(renewLabelComponent.name, renewLabelComponent)
  .filter('renewFrequence', renewFrequenceFilter)
  .run(/* @ngTranslationsInject:json ./common/translations */)
  .run(
    /* @ngInject */ ($translate) => {
      let lang = $translate.use();

      if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
        lang = lang.toLowerCase().replace('_', '-');
      } else {
        [lang] = lang.split('_');
      }

      return import(`script-loader!moment/locale/${lang}.js`).then(() =>
        moment.locale(lang),
      );
    },
  )
  .run(
    /* @ngInject */ ($rootScope, coreConfig) => {
      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
  .run(billingTracking);

export default moduleName;
