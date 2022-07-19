/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import { isString, get } from 'lodash-es';

import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';

import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

export default (containerEl, environment) => {
  const moduleName = 'smsApp';

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment),
        ngOvhApiWrappers,
        ngUiRouterBreadcrumb,
        ovhManagerSms,
        'pascalprecht.translate',
        uiRouter,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/sms');
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
