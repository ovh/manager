import angular from 'angular';
import { isString, get } from 'lodash-es';

import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import EmailDomain from '@ovh-ux/manager-email-domain';

export default (containerEl, environment) => {
  const moduleName = 'emailDomainApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        EmailDomain,
        uiRouter,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/email_domain'),
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
