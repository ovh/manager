import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-translate';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import ngOvhUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import { isString, get, has } from 'lodash-es';

import '@ovh-ux/ui-kit';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerHub from '@ovh-ux/manager-hub';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';
import ovhManagerOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';

import atInternet from './components/at-internet';
import errorPage from './components/error-page';
import dashboard from './dashboard';

import controller from './controller';
import routing from './routing';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './index.less';
import './index.scss';

export default (containerEl, environment) => {
  const moduleName = 'managerHubApp';

  angular
    .module(
      moduleName,
      [
        atInternet,
        dashboard,
        errorPage,
        'ngAnimate',
        ngOvhFeatureFlipping,
        ngOvhSsoAuthModalPlugin,
        ngOvhUiRouterLineProgress,
        ngUiRouterBreadcrumb,
        'oui',
        ovhManagerAccountSidebar,
        registerCoreModule(environment),
        ovhManagerHub,
        ovhManagerNavbar,
        ovhManagerOrderTracking,
        ovhNotificationsSidebar,
        ovhManagerBanner,
        ovhManagerCookiePolicy,
        ngOvhPaymentMethod,
        'pascalprecht.translate',
        'ui.bootstrap',
        uiRouter,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ (coreConfigProvider) => {
        coreConfigProvider.setEnvironment(environment);
      },
    )
    .controller('HubController', controller)
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName(
          environment.getApplicationName(),
        );
      },
    )
    .config(routing)
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
      },
    )
    .run(
      /* @ngInject */ ($anchorScroll, $rootScope, $translate, $transitions) => {
        $transitions.onSuccess({}, () => $anchorScroll('hub-scroll-top'));

        $transitions.onSuccess({ to: 'error' }, () => {
          $rootScope.$emit('ovh::sidebar::hide');
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
      /* @ngInject */ ($state) => {
        $state.defaultErrorHandler((error) => {
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
    .run(/* @ngTranslationsInject:json ./translations */)
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
