/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerVeeamEnterprise from '@ovh-ux/manager-veeam-enterprise';

import { momentConfiguration } from './config';

angular
  .module('veeamEnterpriseApp', [
    ngUiRouterBreadcrumb,
    ovhManagerCore,
    ovhManagerVeeamEnterprise,
  ])
  .config(momentConfiguration)
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/veeam-enterprise');
    },
  );
