/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

angular
  .module('smsApp', [
    ngOvhApiWrappers,
    ngUiRouterBreadcrumb,
    ovhManagerSms,
    'pascalprecht.translate',
    uiRouter,
  ])
  .config(
    /* @ngInject */ ($urlRouterProvider) => {
      $urlRouterProvider.otherwise('/sms');
    },
  );
