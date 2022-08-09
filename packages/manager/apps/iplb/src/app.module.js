/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!chart.js/dist/Chart.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { isString, get } from 'lodash-es';

import angular from 'angular';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerIplb from '@ovh-ux/manager-iplb';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

export default (containerEl, environment) => {
  const moduleName = 'iplbApp';
  angular
    .module(
      moduleName,
      [
        ngOvhCloudUniverseComponents,
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerIplb,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ (CucConfigProvider) => {
        CucConfigProvider.setRegion(environment.getRegion());
      },
    )
    .config(
      /* @ngInject */ ($qProvider) => {
        $qProvider.errorOnUnhandledRejections(false);
      },
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/iplb');
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
    strictDi: true,
  });

  return moduleName;
};
