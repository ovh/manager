import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import { isString, get } from 'lodash-es';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Exchange from '@ovh-ux/manager-exchange';

export default (containerEl, environment) => {
  const moduleName = 'ExchangeApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngAtInternet,
        ngOvhChart,
        ngUiRouterBreadcrumb,
        uiRouter,
        Exchange,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/configuration/exchange'),
    )
    .config(
      /* @ngInject */ ($stateProvider) => {
        $stateProvider.state('app', {
          url: '',
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
    strictDi: false,
  });

  return moduleName;
};
