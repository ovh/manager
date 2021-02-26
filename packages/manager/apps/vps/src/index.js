/* eslint-disable import/extensions, import/no-webpack-loader-syntax */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
import 'script-loader!jsurl/lib/jsurl';
import 'script-loader!bootstrap/dist/js/bootstrap';
/* eslint-enable import/extensions, import/no-webpack-loader-syntax */

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import cloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerVps from '@ovh-ux/manager-vps';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('vpsApp', [
    cloudUniverseComponents,
    ngUiRouterBreadcrumb,
    ovhManagerCore,
    ovhManagerVps,
    ngOvhPaymentMethod,
  ])
  .config(
    /* @ngInject */ (CucConfigProvider) => {
      CucConfigProvider.setRegion(Environment.getRegion());
    },
  )
  .config(
    /* @ngInject */ (ovhPaymentMethodProvider) => {
      ovhPaymentMethodProvider.setUserLocale(Environment.getUserLocale());
    },
  )
  .config(momentConfiguration)
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/vps');
    },
  );
