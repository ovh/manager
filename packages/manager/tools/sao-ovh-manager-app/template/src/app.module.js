<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import errorPage from './error';

import '@ovh-ux/ui-kit/dist/css/oui.css';

import <%= pascalcasedName %> from '@ovh-ux/manager-<%= name %>';

export default (containerEl, environment) => {
  const moduleName = '<%= pascalcasedName %>App';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        uiRouter,
        errorPage,
        <%= pascalcasedName %>,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/<%= name %>');
      },
    )
    .run(
      /* @ngInject */($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .run(
      /* @ngInject */($state) => {
        $state.defaultErrorHandler((error) => {
          if (error.type === RejectType.ERROR) {
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
              },
              { location: false }
            )
          }
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
