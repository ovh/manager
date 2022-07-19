/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */
import angular from 'angular';
import '@uirouter/angularjs';
import { isString, get } from 'lodash-es';
import { registerCoreModule } from '@ovh-ux/manager-core';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';

import './index.scss';

export default (containerEl, environment) => {
  const moduleName = 'enterpriseCloudDatabaseApp';

  angular
    .module(
      moduleName,
      [
        'ui.router',
        registerCoreModule(environment),
        ngUiRouterBreadcrumb,
        ovhManagerEnterpriseCloudDatabase,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/enterprise-cloud-database'),
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
