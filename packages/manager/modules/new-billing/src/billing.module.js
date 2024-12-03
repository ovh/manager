import angular from 'angular';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngRoute from 'angular-route';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngSanitize from 'angular-sanitize';
import ovhManagerCore from '@ovh-ux/manager-core';
import set from 'lodash/set';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from '@uirouter/angularjs';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import '@ovh-ux/ng-ui-router-breadcrumb';
import 'ovh-api-services';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import ngOvhContacts from '@ovh-ux/ng-ovh-contacts';

import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
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

import routing from './billing.routing';
import billingTracking from './atInternetTracking.config';

const moduleName = 'Billing';

angular
  .module(moduleName, [
    autorenew,
    billingMain,
    history,
    'oui',
    'ui.bootstrap',
    'ui.router',
    'ui.select',
    'ngRoute',
    'ngSanitize',
    'ovh-api-services',
    ngOvhUserPref,
    paymentCreditAdd,
    order,
    ordersMain,
    orders,
    ordersPurchases,
    ovhAccountRefund,
    refunds,
    ngOvhExportCsv,
    ngOvhUtils,
    ngRoute,
    ngSanitize,
    ngTranslateAsyncLoader,
    ngOvhContacts,
    ngOvhFeatureFlipping,
    ngOvhOrderTracking,
    ngOvhPaymentMethod,
    ngUiRouterLayout,
    ovhManagerCore,
    payment,
    paymentMehtod,
    sla,
    termination,
    uiBootstrap,
    uiRouter,
    'ngUiRouterBreadcrumb',
    ngAtInternetUiRouterPlugin,
  ])
  .service('billingFeatureAvailability', featureAvailability)
  .service('BillingdateRangeSelection', dateRangeSelectionService)
  .service('BillingDebtAccount', debtAccount)
  .service('BillingmessageParser', messageParser)
  .service('billingRenewHelper', renewHelper)
  .service('BillingUser', userService)
  .config(routing)
  .config(
    /* @ngInject */ (
      $stateProvider,
      $urlRouterProvider,
      $urlServiceProvider,
    ) => {
      $urlServiceProvider.rules.when(
        '/billing/order/:id',
        '/billing/orders/:id',
      );

      $urlRouterProvider.when(
        /^\/billing\/(credits|fidelity|mean|method|ovhaccount|vouchers)/,
        ($location, $state) => {
          const [, subroute] = $location.$$path.split('/billing/');
          return $state.go(`billing.payment.${subroute}`);
        },
      );
    },
  )
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
