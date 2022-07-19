/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';
/* eslint-enable import/no-webpack-loader-syntax */

import { isString, get } from 'lodash-es';

import angular from 'angular';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import { registerCoreModule } from '@ovh-ux/manager-core';

import ovhManagerVeeamEnterprise from '@ovh-ux/manager-veeam-enterprise';

export default (containerEl, environment) => {
  const moduleName = 'veeamEnterpriseApp';

  angular
    .module(
      moduleName,
      [
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerVeeamEnterprise,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/veeam-enterprise');
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
