import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-at-internet';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
// TODO: Change to '@ovh-ux/manager-account' when module is deployed
// import Account from '@ovh-ux/manager-account';
import Account from '../../../modules/account/src';
import errorPage from './error';

import TRACKING from './tracking/at-internet.constants';
import '@ovh-ux/ui-kit/dist/css/oui.css';

export default async (containerEl, shellClient) => {
  const moduleName = 'AccountApp';

  const routingConfig = /* @ngInject */ ($urlRouterProvider) => {
    $urlRouterProvider.otherwise('/');
  };

  const trackingConfig = /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setSkipInit(true);
    atInternetConfigurationProvider.setPrefix('dedicated');
  };

  const [environment, locale] = await Promise.all([
    shellClient.environment.getEnvironment(),
    shellClient.i18n.getLocale(),
  ]);

  const coreCallbacks = {
    onLocaleChange: (lang) => {
      shellClient.i18n.setLocale(lang);
    },
  };

  const ssoAuthConfig = /* @ngInject */ (ssoAuthenticationProvider) => {
    ssoAuthenticationProvider.setOnLogin(() => {
      shellClient.auth.login();
    });
    ssoAuthenticationProvider.setOnLogout(() => {
      shellClient.auth.logout();
    });
  };

  const calendarConfigProvider = /* @ngInject */ (
    ouiCalendarConfigurationProvider,
  ) => {
    const [lang] = locale.split('_');
    return import(`flatpickr/dist/l10n/${lang}.js`)
      .then((module) => {
        ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
      })
      .catch(() => {});
  };

  const broadcastAppStarted = /* @ngInject */ ($rootScope, $transitions) => {
    const unregisterHook = $transitions.onSuccess({}, async () => {
      if (!isTopLevelApplication()) {
        await shellClient.ux.hidePreloader();
      }
      $rootScope.$broadcast('app:started');
      unregisterHook();
    });
  };

  const transitionsConfig = /* @ngInject */ ($transitions) => {
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
  };

  const defaultErrorHandler = /* @ngInject */ ($state) => {
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
  };

  angular
    .module(
      moduleName,
      [
        registerCoreModule(environment, coreCallbacks),
        registerAtInternet(shellClient.tracking),
        ovhManagerAtInternetConfiguration,
        ngOvhSsoAuth,
        ngUiRouterBreadcrumb,
        'oui',
        uiRouter,
        errorPage,
        Account,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .constant('shellClient', shellClient)
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(routingConfig)
    .config(ssoAuthConfig)
    .config(async () => {
      await shellClient.tracking.setConfig(environment.getRegion(), TRACKING);
    })
    .config(trackingConfig)
    .config(calendarConfigProvider)
    .run(broadcastAppStarted)
    .run(transitionsConfig)
    .run(defaultErrorHandler);

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
