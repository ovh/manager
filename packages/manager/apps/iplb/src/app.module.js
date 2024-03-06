/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { isString, get } from 'lodash-es';

import angular from 'angular';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerFilters from '@ovh-ux/manager-filters';
import ovhManagerIplb from '@ovh-ux/manager-iplb';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

export default (containerEl, environment) => {
  const moduleName = 'iplbApp';
  angular
    .module(
      moduleName,
      [
        ngOvhChart,
        ngOvhCloudUniverseComponents,
        ngOvhFeatureFlipping,
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerFilters,
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
