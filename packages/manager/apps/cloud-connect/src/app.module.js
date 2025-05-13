import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import angular from 'angular';
import { isString, get } from 'lodash-es';
import 'angular-animate';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerCloudConnect from '@ovh-ux/manager-cloud-connect';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'font-awesome/css/font-awesome.min.css';

export default (containerEl, environment) => {
  const moduleName = 'cloudConnectApp';
  angular
    .module(
      moduleName,
      [
        ngOvhChart,
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerCloudConnect,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/cloud-connect'),
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
