/* eslint-disable import/extensions, import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!jsurl/lib/jsurl';
import 'script-loader!bootstrap/dist/js/bootstrap';
/* eslint-enable import/extensions, import/no-webpack-loader-syntax */

import { isString, get } from 'lodash-es';

import angular from 'angular';
import cloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ngOvhChart from '@ovh-ux/ng-ovh-chart';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';

import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerVps from '@ovh-ux/manager-vps';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

export default (containerEl, environment) => {
  const moduleName = 'vpsApp';
  angular
    .module(
      moduleName,
      [
        cloudUniverseComponents,
        ngUiRouterBreadcrumb,
        registerCoreModule(environment),
        ovhManagerVps,
        ngAtInternet,
        ngOvhChart,
        ngOvhFeatureFlipping,
        ngOvhPaymentMethod,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ (CucConfigProvider) => {
        CucConfigProvider.setRegion(environment.getRegion());
      },
    )
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
      },
    )
    .config(
      /* @ngInject */ ($qProvider) => {
        $qProvider.errorOnUnhandledRejections(false);
      },
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/vps');
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
