import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import 'babel-polyfill';
import angular from 'angular';
import 'angular-translate';
import uiRouter from '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

import WebPaas from '@ovh-ux/manager-web-paas';

export default (containerEl, environment) => {
  const moduleName = 'WebPaasApp';

  angular
    .module(moduleName, [
      'pascalprecht.translate',
      registerCoreModule(environment),
      ngOvhApiWrappers,
      ngUiRouterBreadcrumb,
      uiRouter,
      WebPaas,
    ])
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/paas/webpaas'),
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
