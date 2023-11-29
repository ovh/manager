/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import angular from 'angular';
import ngAnimate from 'angular-animate';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import 'jquery-ui/ui/widget';
import 'jquery-ui/ui/widgets/mouse';
import 'jquery-ui/ui/widgets/draggable';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!angular-ui-validate/dist/validate.js';
import '@ovh-ux/ui-kit';
import 'script-loader!clipboard/dist/clipboard.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';

import { registerCoreModule } from '@ovh-ux/manager-core';
import ovhManagerPci from '@ovh-ux/manager-pci';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import '@ovh-ux/ng-at-internet';
import '@ovh-ux/ui-kit/dist/css/oui.css';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import { initAtInternet } from './components/at-internet';

import './assets/theme/default/index.less';
import './index.scss';

import controller from './index.controller';
import service from './index.service';
import routing from './index.routes';

const getEnvironment = (shellClient) => {
  return shellClient.environment.getEnvironment();
};

const getLocale = (shellClient) => {
  return shellClient.i18n.getLocale();
};

export default async (containerEl, shellClient) => {
  const moduleName = 'ovhPublicCloudApp';

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
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
        initAtInternet(environment.getRegion(), shellClient.tracking),
        ngAnimate,
        ngUiRouterBreadcrumb,
        ngOvhApiWrappers,
        ngOvhFeatureFlipping,
        ngOvhPaymentMethod,
        ngOvhUserPref,
        'oui',
        registerCoreModule(environment, coreCallbacks),
        ovhManagerPci,
        uiRouter,
      ].filter(isString),
    ) // Remove null because __NG_APP_INJECTIONS__ can be null
    .controller('PublicCloudController', controller)
    .service('publicCloud', service)
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
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
    .constant('ovhShell', shellClient)
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
    .config(
      /* @ngInject */ (ouiCalendarConfigurationProvider) => {
        const [lang] = locale.split('_');
        return import(`flatpickr/dist/l10n/${lang}.js`)
          .then((module) => {
            ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
          })
          .catch(() => {});
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $state, $transitions) => {
        $transitions.onError({}, (transition) => {
          const error = transition.error();
          if (error.type === RejectType.ERROR) {
            $rootScope.$emit('ovh::sidebar::hide');
            $state.go(
              'pci.error',
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
      /* @ngInject */ ($transitions) => {
        // replace ngOvhUiRouterLineProgress if in container
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
            shellClient.ux.hidePreloader();
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
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          if (!isTopLevelApplication()) {
            shellClient.ux.hidePreloader();
          }
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName('public-cloud');
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
