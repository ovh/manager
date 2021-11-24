import angular from 'angular';

import 'script-loader!bootstrap/dist/js/bootstrap'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import 'script-loader!chart.js/dist/Chart.min.js'; // eslint-disable-line

import uiRouter, { RejectType } from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import CdnDedicated from '@ovh-ux/manager-cdn-dedicated';

import { get, has, isString } from 'lodash-es';
import errorPage from './error';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './theme/index.scss';

export default (containerEl, environment) => {
  const moduleName = 'CdnDedicatedApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngOvhUiRouterLineProgress,
        ngUiRouterBreadcrumb,
        uiRouter,
        ngQAllSettled,
        errorPage,
        CdnDedicated,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/cdn');
      },
    )
    .config(
      /* @ngInject */ ($stateProvider) => {
        $stateProvider.state('app', {
          abstract: true,
        });

        $stateProvider.state('app.networks', {
          abstract: true,
          template: '<ui-view />',
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
          detachPreloader();
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .run(
      /* @ngInject */ ($state) => {
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
              { location: false },
            );
          }
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
