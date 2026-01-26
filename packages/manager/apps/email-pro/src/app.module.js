import angular from 'angular';
import { isString, get } from 'lodash-es';

import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngPaginationFront from '@ovh-ux/ng-pagination-front';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import Emailpro from '@ovh-ux/manager-emailpro';

export default (containerEl, environment) => {
  const moduleName = 'emailproApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        Emailpro,
        uiRouter,
        ngAtInternet,
        ngPaginationFront,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/configuration/email_pro'),
    )
    .config(
      /* @ngInject */ ($stateProvider) =>
        $stateProvider.state('app', {
          url: '',
          abstract: true,
        }),
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
    strictDi: true,
  });

  return moduleName;
};
