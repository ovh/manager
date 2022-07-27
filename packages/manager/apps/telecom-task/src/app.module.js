import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import { isString, get } from 'lodash-es';

import angular from 'angular';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerTelecomTask from '@ovh-ux/manager-telecom-task';

export default (containerEl, environment) => {
  const moduleName = 'telecomTaskApp';
  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        ovhManagerTelecomTask,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/task'),
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
