/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import { Environment } from '@ovh-ux/manager-config';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerVeeamEnterprise from '@ovh-ux/manager-veeam-enterprise';

angular
  .module('veeamEnterpriseApp', [
    ngUiRouterBreadcrumb,
    ovhManagerCore,
    ovhManagerVeeamEnterprise,
  ])
  .config(() => {
    moment.locale(Environment.getUserLanguage());
  })
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/veeam-enterprise');
    },
  );
