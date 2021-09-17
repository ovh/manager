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
import '@ovh-ux/ng-ui-router-breadcrumb';

import autorenew from './autoRenew/autorenew.module';
import billingMain from './main/billing-main.module';
import dateRangeSelectionService from './common/dateRangeSelection';
import debtAccount from './dbtAccount/billing-debtAccount.service';
import featureAvailability from './billing-feature-availability';
import history from './main/history/history.module';
import paymentCreditAdd from './payment/credits/add/add-credits.module';
import messageParser from './common/messageParser';
import order from './order/billing-order-tracking.module';
import orders from './orders/orders.module';
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
    'ngRoute',
    'ngSanitize',
    paymentCreditAdd,
    order,
    orders,
    ovhAccountRefund,
    refunds,
    ngOvhExportCsv,
    ngOvhUtils,
    ngRoute,
    ngSanitize,
    ngTranslateAsyncLoader,
    order,
    orders,
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
  .config(routing)
  .service('billingFeatureAvailability', featureAvailability)
  .service('BillingdateRangeSelection', dateRangeSelectionService)
  .service('BillingDebtAccount', debtAccount)
  .service('BillingmessageParser', messageParser)
  .service('billingRenewHelper', renewHelper)
  .service('BillingUser', userService)
  .service(
    'BillingBill',
    /* @ngInject */ ($resource) =>
      $resource(
        '/me/bill/:billId',
        {
          billId: '@billId',
        },
        {
          getById: {
            serviceType: 'apiv7',
            method: 'GET',
            isArray: true,
          },
        },
      ),
  )
  .directive('billingDateRange', dateRangeDirective)
  .directive('billingSortingFieldButton', sortingFieldButtonDirective)
  .component(renewDateComponent.name, renewDateComponent)
  .component(renewLabelComponent.name, renewLabelComponent)
  .filter('renewFrequence', renewFrequenceFilter)
  .run(
    /* @ngInject */ ($rootScope, coreConfig) => {
      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
  .run(billingTracking);

export default moduleName;
