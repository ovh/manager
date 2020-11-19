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
import order from './order';
import orders from './orders';
import payment from './payment';
import sla from './sla/sla.module';

import featureAvailability from './billing-feature-availability';
import atInternetTrackingConfig from './atInternetTracking.config';
import billingCtrl from './billing.controller';
import routing from './billing.routing';
import servicesModule from './services.module';

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

    autorenew,
    billingCommon,
    billingComponents,
    confirmTermination,
    billingConstants,
    main,
    order,
    orders,
    payment,
    sla,
    servicesModule,
  ])
  .constant('BILLING_BASE_URL', 'billing/')
  .controller('BillingCtrl', billingCtrl)
  .config(routing)
  .service('billingFeatureAvailability', featureAvailability)
  .service('BillingDebtAccount', billingDebtAccountService)
  .run(atInternetTrackingConfig)
  .run(
    /* @ngInject */ ($rootScope, coreConfig) => {
      set($rootScope, 'worldPart', coreConfig.getRegion());
    },
  )
  .constant('IBAN_BIC_RULES', {
    IBAN_FORMAT: {
      FR: [4, 4, 4, 4, 4, 4, 3],
      DE: [4, 4, 4, 4, 4, 2],
      MC: [4, 4, 4, 4, 4, 4, 3],
    },
    IBAN_VALIDATION_MODULO: 97,
    COUNTRY_BASE_REGEXP: {
      AT: new RegExp(/\d{16}/),
      BE: new RegExp(/\d{12}/),
      BG: new RegExp(/\w{4}\d{6}[0-9A-Z]{8}/),
      CH: new RegExp(/\d{5}[0-9A-Z]{12}/),
      CY: new RegExp(/\d{8}[0-9A-Z]{16}/),
      CZ: new RegExp(/\d{20}/),
      DE: new RegExp(/\d{18}/),
      DK: new RegExp(/\d{14}/),
      EE: new RegExp(/\d{16}/),
      ES: new RegExp(/\d{20}/),
      FI: new RegExp(/\d{14}/),
      FR: new RegExp(/\d{10}\w{11}\d{2}/),
      GR: new RegExp(/\d{7}[0-9A-Z]{16}/),
      HU: new RegExp(/\d{24}/),
      IE: new RegExp(/\w{4}\d{14}/),
      IS: new RegExp(/\d{22}/),
      IT: new RegExp(/\w{1}\d{10}[0-9A-Z]{12}/),
      LI: new RegExp(/\d{5}[0-9A-Z]{12}/),
      LT: new RegExp(/\d{16}/),
      LU: new RegExp(/\d{3}[0-9A-Z]{13}/),
      LV: new RegExp(/\w{4}[0-9A-Z]{13}/),
      MC: new RegExp(/\d{10}[0-9A-Z]{11}\d{2}/),
      MT: new RegExp(/\w{4}\d{5}[0-9A-Z]{18}/),
      NL: new RegExp(/\w{4}\d{10}/),
      NO: new RegExp(/\d{9}/),
      PL: new RegExp(/\d{8}[0-9A-Z]{16}/),
      PT: new RegExp(/\d{21}/),
      RO: new RegExp(/\w{4}[0-9A-Z]{16}/),
      SE: new RegExp(/\d{20}/),
      SI: new RegExp(/\d{15}/),
      SK: new RegExp(/\d{20}/),
      UK: new RegExp(/\w{4}\d{14}/),
    },
    BIC_REGEXP: /^([A-Z]{4})([A-Z]{2})(\w{2})(\w{3})?$/g,
    IBAN_REGEXP: /^([A-Z]{2})(\d{2})(.*)$/g,
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
