import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerTelecomTask from '@ovh-ux/manager-telecom-task';

angular
  .module('telecomTaskApp', [ngUiRouterBreadcrumb, ovhManagerTelecomTask])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/task'),
  );
