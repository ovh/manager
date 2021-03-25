import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Office from '@ovh-ux/manager-office';

Environment.setVersion(__VERSION__);

const moduleName = 'OfficeApp';

angular
  .module(moduleName, [
    ovhManagerCore,
    ngOvhUiRouterLineProgress,
    ngUiRouterBreadcrumb,
    uiRouter,
    Office,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/configuration/microsoft/office/license'),
  )
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state('app', {
        abstract: true,
        template: '<div ui-view></div>',
      });
      $stateProvider.state('app.microsoft', {
        abstract: true,
        template: '<div ui-view></div>',
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
