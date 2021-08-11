/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import angular from 'angular';
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!angular-ui-validate/dist/validate.js';
import '@ovh-ux/ui-kit';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { isString, get } from 'lodash-es';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ngOvhPaymentMethod from '@ovh-ux/ng-ovh-payment-method';
import ngOvhFeatureFlipping from '@ovh-ux/ng-ovh-feature-flipping';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import '@ovh-ux/manager-pci';

export default (containerEl, environment) => {
  const moduleName = 'pciApp';

  angular
    .module(
      moduleName,
      [
        'ovhManagerPci',
        ngOvhPaymentMethod,
        ngOvhFeatureFlipping,
        registerCoreModule(environment),
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) =>
        $urlRouterProvider.otherwise('/pci/projects'),
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
