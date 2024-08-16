import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import angular from 'angular';
import 'angular-ui-bootstrap';
import 'angular-animate';
import 'angular-translate';
import '@ovh-ux/ng-at-internet';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';

import { isString, get, has } from 'lodash-es';

import '@ovh-ux/ui-kit';
import ovhManagerBanner from '@ovh-ux/manager-banner';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerHub from '@ovh-ux/manager-hub';
import ovhManagerOrderTracking from '@ovh-ux/ng-ovh-order-tracking';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { isTopLevelApplication } from '@ovh-ux/manager-config';

import { initHubAtInternet } from './components/at-internet';
import errorPage from './components/error-page';
import dashboard from './dashboard';

import controller from './controller';
import routing from './routing';
import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './index.less';
import './index.scss';

const getEnvironment = (shellClient) => {
  return shellClient.environment.getEnvironment();
};

const getLocale = (shellClient) => {
  return shellClient.i18n.getLocale();
};

export default async (containerEl, shellClient) => {
  const moduleName = 'managerHubApp';

  const [environment, locale] = await Promise.all([
    getEnvironment(shellClient),
    getLocale(shellClient),
  ]);

  const coreCallbacks = {
    onLocaleChange: (lang) => {
      shellClient.i18n.setLocale(lang);
    },
  };

  angular
    .module(
      moduleName,
      [
        initHubAtInternet(environment.getRegion(), shellClient.tracking),
        dashboard,
        errorPage,
        'ngAnimate',
        ngOvhCloudUniverseComponents,
        ngOvhFeatureFlipping,
        ngUiRouterBreadcrumb,
        'oui',
        registerCoreModule(environment, coreCallbacks),
        ovhManagerHub,
        ovhManagerOrderTracking,
        ovhManagerBanner,
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
        ovhPaymentMethodProvider.setUserLocale(locale);
      },
    )
    .config(
      /* @ngInject */ (ssoAuthenticationProvider) => {
        ssoAuthenticationProvider.setOnLogin(() => {
          shellClient.auth.login();
        });
        ssoAuthenticationProvider.setOnLogout(() => {
          shellClient.auth.logout();
        });
      },
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.when('/catalog', () => {
          shellClient.navigation.getURL('catalog', '/').then((url) => {
            window.top.location.href = url;
          });
        });
      },
    )
    .run(
      /* @ngInject */ ($transitions) => {
        if (!isTopLevelApplication()) {
          $transitions.onBefore({}, (transition) => {
            if (
              !transition.ignored() &&
              transition.from().name !== '' &&
              transition.entering().length > 0
            ) {
              shellClient.ux.startProgress();
            }
          });

          $transitions.onSuccess({}, () => {
            shellClient.ux.stopProgress();
          });

          $transitions.onError({}, (transition) => {
            if (!transition.error().redirected) {
              shellClient.ux.stopProgress();
            }
          });
        }
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $translate, $transitions) => {
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
      /* @ngInject */ ($state, $transitions) => {
        $transitions.onError({}, (transition) => {
          const error = transition.error();
          if (error.type === RejectType.ERROR) {
            $state.go(
              'error',
              {
                detail: {
                  message: get(error.detail, 'data.message'),
                  status: error.detail.status,
                  code: has(error.detail, 'headers')
                    ? error.detail.headers('x-ovh-queryId')
                    : null,
                },
                to: {
                  state: transition.to(),
                  params: transition.params(),
                },
              },
              { location: false },
            );
          }
        });
        $state.defaultErrorHandler((error) => {
          return error;
        });
      },
    )
    .run(/* @ngTranslationsInject:json ./translations */)
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          if (!isTopLevelApplication()) {
            shellClient.ux.hidePreloader();
          }
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
