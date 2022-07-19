import 'script-loader!moment/min/moment.min.js'; //eslint-disable-line
import angular from 'angular';

import { isString, get } from 'lodash-es';

import { registerCoreModule } from '@ovh-ux/manager-core';
// Module dependencies.
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';
import uiRouter from '@uirouter/angularjs';

import cdr from './cdr';
import endpoints from './endpoints';

// Routing and configuration.
import routing from './routing';

// Styles.
import '@ovh-ux/ui-kit/dist/css/oui.css';

export default (containerEl, environment) => {
  const moduleName = 'carrierSipApp';
  angular
    .module(
      moduleName,
      [
        cdr,
        endpoints,
        ovhManagerCarrierSip,
        uiRouter,
        registerCoreModule(environment),
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(routing)
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
