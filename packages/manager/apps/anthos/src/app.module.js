import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import Anthos from '@ovh-ux/manager-anthos';
import errorPage from './error';

import '@ovh-ux/ui-kit/dist/css/oui.css';

export default (containerEl, environment) => {
  const moduleName = 'AnthosApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngOvhUiRouterLineProgress,
        ngUiRouterBreadcrumb,
        uiRouter,
        errorPage,
        Anthos,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/anthos');
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .run(
      /* @ngInject */ ($state, $transitions) => {
        $transitions.onError({}, (transition) => {
          const error = transition.error();
          if (error.type === RejectType.ERROR) {
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  status: error.detail.status,
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
                to: {
                  state: transition.to(),
                  params: transition.params(),
                },
              },
              { location: false },
            );
          }
        });
        $state.defaultErrorHandler((error) => {
          return error;
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
