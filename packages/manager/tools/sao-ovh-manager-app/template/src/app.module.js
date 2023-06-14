<% const pascalcasedName = this.camelcase(name, { pascalCase: true }) -%>
import angular from 'angular';
import get from 'lodash/get';
import has from 'lodash/has';
import isString from 'lodash/isString';
import uiRouter, {RejectType} from '@uirouter/angularjs';
import '@ovh-ux/ui-kit';
import { isTopLevelApplication } from '@ovh-ux/manager-config';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import <%= pascalcasedName %> from '@ovh-ux/manager-<%= name %>';
import errorPage from './error';

import '@ovh-ux/ui-kit/dist/css/oui.css';


export default async (containerEl, shellClient) => {
  const moduleName = '<%= pascalcasedName %>App';

  const [environment, locale] = await Promise.all([
    shellClient.environment.getEnvironment(),
    shellClient.i18n.getLocale(),
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
        registerCoreModule(environment, coreCallbacks),
        registerAtInternet(shellClient.tracking),
        ngOvhSsoAuth,
        ngUiRouterBreadcrumb,
        'oui',
        uiRouter,
        errorPage,
        <%= pascalcasedName %>,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .constant('shellClient', shellClient)
    .config(
      /* @ngInject */($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/<%= name %>');
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
    // @TODO initialize tracking configuration here
    // .config(async () => {
    //   await shellClient.tracking.setConfig(TRACKING);
    // })
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
      /* @ngInject */($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, async () => {
          if (!isTopLevelApplication()) {
            await shellClient.ux.hidePreloader();
          }
          $rootScope.$broadcast('app:started');
          unregisterHook();
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
      /* @ngInject */($state) => {
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
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
