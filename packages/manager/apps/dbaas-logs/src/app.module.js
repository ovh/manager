import angular from 'angular';
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line

import 'script-loader!angular-websocket/dist/angular-websocket'; // eslint-disable-line
import 'script-loader!bootstrap/dist/js/bootstrap'; // eslint-disable-line
import 'regenerator-runtime/runtime';
import { isString, get } from 'lodash-es';

import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import DbaasLogs from '@ovh-ux/manager-dbaas-logs';
import atInternet from './components/at-internet';

export default (containerEl, environment) => {
  const moduleName = 'DbaasLogsApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        uiRouter,
        DbaasLogs,
        atInternet,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/dbaas/logs'),
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
