import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import uiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';

angular
  .module('freefaxApp', [
    ngOvhApiWrappers,
    ovhManagerFreeFax,
    uiRouterBreadcrumb,
  ])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/freefax'),
  );
