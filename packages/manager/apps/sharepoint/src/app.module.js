import { isString, get } from 'lodash-es';

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Sharepoint from '@ovh-ux/manager-sharepoint';

export default (containerEl, environment) => {
  const moduleName = 'SharepointApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        uiRouter,
        Sharepoint,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/sharepoint'),
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
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: false,
  });

  return moduleName;
};
