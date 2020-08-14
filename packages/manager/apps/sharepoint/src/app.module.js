import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Sharepoint from '@ovh-ux/manager-sharepoint';

Environment.setVersion(__VERSION__);

const moduleName = 'SharepointApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    Sharepoint,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/configuration/microsoft/sharepoint'),
  )
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app', {
        abstract: true,
        div: '<ui-view></ui-view>',
      });

      $stateProvider.state('app.microsoft', {
        abstract: true,
        div: '<ui-view></ui-view>',
      });
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
