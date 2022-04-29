/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';

import angular from 'angular';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { isString, get } from 'lodash-es';
import { registerCoreModule } from '@ovh-ux/manager-core';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhManagerNasha from '@ovh-ux/manager-nasha';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngOvhUtils from '@ovh-ux/ng-ovh-utils';
import ngUiRouterLayout from '@ovh-ux/ng-ui-router-layout';
import ngUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import 'ovh-api-services';

import './index.scss';

export default (containerEl, environment) => {
  const moduleName = 'nashaApp';
  angular
    .module(
      'nashaApp',
      [
        'ovh-api-services',
        ovhManagerNasha,
        ngUiRouterBreadcrumb,
        ngOvhUtils,
        ngUiRouterLayout,
        ngUiRouterLineProgress,
        registerCoreModule(environment),
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/nasha');
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
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
