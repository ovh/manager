import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { isString, get } from 'lodash-es';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerMetrics from '@ovh-ux/manager-metrics';

import './index.less';

export default (containerEl, environment) => {
  const moduleName = 'metricsApp';

  angular
    .module(
      moduleName,
      [
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerMetrics,
        uiRouter,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/metrics'),
    )
    .run(
      /* @ngInject */ ($translate) => {
        let lang = $translate.use();

        if (['en_GB', 'es_US', 'fr_CA'].includes(lang)) {
          lang = lang.toLowerCase().replace('_', '-');
        } else {
          [lang] = lang.split('_');
        }

        return import(`script-loader!moment/locale/${lang}.js`).then(() =>
          moment.locale(lang),
        );
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
    strictDi: true,
  });

  return moduleName;
};
