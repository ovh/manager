import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import 'bootstrap';
import 'angular-ui-bootstrap';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';

import { Environment } from '@ovh-ux/manager-config';
import ovhManagerCore from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';

import { billingManagement } from '@ovh-ux/manager-billing';
import routing from './app.routing';

Environment.setVersion(__VERSION__);

const moduleName = 'BillingApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    billingManagement,
    ngQAllSettled,
    'ui.bootstrap',
    ngPaginationFront,
  ])
  .config(routing)
  .config(
    /* @ngInject */ ($locationProvider, $urlRouterProvider) => {
      $locationProvider.hashPrefix('');
      $urlRouterProvider.otherwise('/billing/history');
    },
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
