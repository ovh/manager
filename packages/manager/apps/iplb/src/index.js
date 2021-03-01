/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
import 'script-loader!chart.js/dist/Chart.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerIplb from '@ovh-ux/manager-iplb';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('iplbApp', [
    ngOvhCloudUniverseComponents,
    ngUiRouterBreadcrumb,
    ovhManagerCore,
    ovhManagerIplb,
  ])
  .config(
    /* @ngInject */ (CucConfigProvider) => {
      CucConfigProvider.setRegion(Environment.getRegion());
    },
  )
  .config(() => {
    moment.locale(Environment.getUserLanguage());
  })
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/iplb');
    },
  );
