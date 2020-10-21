import angular from 'angular';
import set from 'lodash/set';

import 'angular-route';
import 'angular-sanitize';
import 'bootstrap';
import 'angular-ui-bootstrap';
import '@uirouter/angularjs';
import 'angular-translate';
import 'oclazyload';
import 'ovh-api-services';
import '@ovh-ux/ng-at-internet';
import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import dedicatedUniversalComponents from '@ovh-ux/ng-ovh-dedicated-universe-components';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';

import autorenew from './autoRenew/autorenew.module';
import billingCommon from './common';
import billingComponents from './components';
import confirmTermination from './confirmTerminate/termination.module';
import billingConstants from './constants/constants.module';
import billingDebtAccountService from './dbtAccount/billing-debtAccount.service';
import main from './main';

// import order from './order/billing-order-tracking.module';
// import orders from './orders/orders.module';
// import sla from './sla/sla.module';
// import paymentMehtod from './payment/method';

import featureAvailability from './billing-feature-availability';
import billingCtrl from './billing.controller';
import routing from './billing.routing';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './billing.scss';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'font-awesome/css/font-awesome.css';

const moduleName = 'ovhManagerBilling';

angular
  .module(moduleName, [
    'ngRoute',
    'ngSanitize',
    'ui.bootstrap',
    'ui.router',
    'pascalprecht.translate',
    'oc.lazyLoad',
    'ovh-api-services',
    ovhManagerCore,
    dedicatedUniversalComponents,
    ngOvhExportCsv,
    ngOvhUtils,
    ovhManagerAccountMigration,
    ngQAllSettled,

    // 'Billing.constants',
    // 'Billing.controllers',
    // 'Billing.directives',
    // 'Billing.filters',
    // 'Billing.services',
    autorenew,
    billingCommon,
    billingComponents,
    confirmTermination,
    billingConstants,
    main,

    // order,
    // orders,

    // sla,
    // termination,

    // paymentMehtod,
  ])
  .controller('BillingCtrl', billingCtrl)
  .config(routing)
  .service('billingFeatureAvailability', featureAvailability)
  .service('BillingDebtAccount', billingDebtAccountService)
  .run(
    /* @ngInject */ ($rootScope, coreConfig) => {
      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
