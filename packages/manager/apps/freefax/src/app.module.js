import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line

import { RejectType } from '@uirouter/angularjs';
import { get, has } from 'lodash-es';

import angular from 'angular';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import uiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';
import managerNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';
import managerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import controller from './controller';

import './index.scss';

export default (containerEl, environment) => {
  const moduleName = 'freefaxApp';

  angular
    .module(moduleName, [
      registerCoreModule(environment),
      ngOvhApiWrappers,
      ovhManagerFreeFax,
      uiRouterBreadcrumb,
      managerNotificationsSidebar,
      managerAccountSidebar,
      ngOvhFeatureFlipping,
      ngOvhPaymentMethod,
      ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
    ])
    .controller('FreefaxAppController', controller)
    .config(
      /* @ngInject */ (ovhFeatureFlippingProvider) => {
        ovhFeatureFlippingProvider.setApplicationName(
          environment.getApplicationName(),
        );
      },
    )
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/freefax'),
    )
    .config(
      /* @ngInject */ (ovhPaymentMethodProvider) => {
        ovhPaymentMethodProvider.setUserLocale(environment.getUserLocale());
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
          if (error.type === RejectType.ERROR) {
            // Useful for our error monitoring tool.
            $log.error(error);

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
