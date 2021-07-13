import angular from 'angular';
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line
import 'script-loader!chart.js/dist/Chart.min.js'; // eslint-disable-line
import 'script-loader!angular-websocket/dist/angular-websocket'; // eslint-disable-line
import 'script-loader!bootstrap/dist/js/bootstrap'; // eslint-disable-line

import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-translate';
import 'bootstrap';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngQAllSettled from '@ovh-ux/ng-q-allsettled';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import { isString, get, has } from 'lodash-es';

import '@ovh-ux/ui-kit';
import ovhManagerBilling from '@ovh-ux/manager-billing';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

export default (containerEl, environment) => {
  const moduleName = 'managerBillingApp';

  angular
    .module(
      moduleName,
      [
        'ngAnimate',
        ngOvhFeatureFlipping,
        ngOvhSsoAuthModalPlugin,
        ngOvhUiRouterLineProgress,
        ngUiRouterBreadcrumb,
        'oui',
        registerCoreModule(environment),
        ngQAllSettled,
        ovhManagerBilling,
        ovhManagerOrderTracking,
        ovhManagerCookiePolicy,
        ngOvhPaymentMethod,
        'pascalprecht.translate',
        'ui.bootstrap',
        uiRouter,
      ].filter(isString),
    )
    .config(
      /* @ngInject */ (coreConfigProvider) => {
        coreConfigProvider.setEnvironment(environment);
      },
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/billing/autorenew');
      },
    )
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName(
          environment.getApplicationName(),
        );
      },
    )
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
      },
    )
    .config(
      /* @ngInject */ ($stateProvider) => {
        $stateProvider.state('app', {
          abstract: true,
        });
        $stateProvider.state('app.account', {
          abstract: true,
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
      /* @ngInject */ ($log, $state) => {
        $state.defaultErrorHandler((error) => {
          $log.error(error);
          if (error.type === RejectType.ERROR) {
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
              },
              { location: false },
            );
          }
        });
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
