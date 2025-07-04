import angular from 'angular';

import '@uirouter/angularjs';
import 'oclazyload';

import '@ovh-ux/ng-ui-router-breadcrumb';
import 'ovh-api-services';
import 'core-js/stable';

import ngOvhExportCsv from '@ovh-ux/ng-ovh-export-csv';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngRoute from 'angular-route';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ngSanitize from 'angular-sanitize';

import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import ngOvhContacts from '@ovh-ux/ng-ovh-contacts';
import ngOvhHttp from '@ovh-ux/ng-ovh-http';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ovhManagerAccountMigration from '@ovh-ux/manager-account-migration';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';

import 'bootstrap';
import 'angular-ui-bootstrap';
import 'punycode';

const moduleName = 'ovhManagerDedicatedBillingLazyLoading';

angular
  .module(moduleName, [
    'ui.select',
    'ngRoute',
    'ngSanitize',
    'ovh-api-services',
    ngOvhUserPref,
    'ui.router',
    'oc.lazyLoad',
    ngOvhExportCsv,
    ngOvhUtils,
    ngRoute,
    ngTranslateAsyncLoader,
    ngSanitize,
    ngAtInternetUiRouterPlugin,
    ngOvhPaymentMethod,
    ngUiRouterLayout,
    ngOvhFeatureFlipping,
    ngOvhOrderTracking,
    ngOvhContacts,
    ngOvhHttp,
    'ngUiRouterBreadcrumb',
    ngAtInternetUiRouterPlugin,
    ngQAllSettled,
    ovhManagerAccountMigration,
  ])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('billing.**', {
        url: '/',
        lazyLoad: ($transition$) => {
          const $ocLazyLoad = $transition$.injector().get('$ocLazyLoad');

          return import('./billing.module').then((mod) =>
            $ocLazyLoad.inject(mod.default || mod),
          );
        },
      });
    },
  );

export default moduleName;
