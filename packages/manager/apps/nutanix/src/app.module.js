import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import Nutanix from '@ovh-ux/manager-nutanix';

import errorPage from './error';
import './index.scss';

import '@ovh-ux/ui-kit/dist/css/oui.css';

export default (containerEl, environment) => {
  const moduleName = 'NutanixApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngOvhUiRouterLineProgress,
        ngUiRouterBreadcrumb,
        uiRouter,
        errorPage,
        Nutanix,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/nutanix');
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
