/* eslint-disable import/extensions */
/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!moment/min/moment.min.js';
import 'script-loader!urijs/src/URI.min.js';
import 'script-loader!ipaddr.js/ipaddr.min.js';
import 'script-loader!jsurl/lib/jsurl.js';
import 'regenerator-runtime/runtime';
import 'angular';
import 'bootstrap';
import 'angular-ui-bootstrap';
import '@ovh-ux/ui-kit';
import 'font-awesome/css/font-awesome.min.css';

import { registerCoreModule } from '@ovh-ux/manager-core';
import uiRouter from '@uirouter/angularjs';

import { isString, get } from 'lodash-es';

import ovhManagerLicense from '@ovh-ux/manager-license';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import './license.scss';

export default (containerEl, environment) => {
  const moduleName = 'licenseApp';

  angular
    .module(
      moduleName,
      [
        ovhManagerLicense,
        'oui',
        registerCoreModule(environment),
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
    .config(
      /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
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
    .run(/* @ngTranslationsInject:json ./translations */)
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          detachPreloader();
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    )
    .config(
      /* @ngInject */ ($urlRouterProvider) => {
        $urlRouterProvider.otherwise('/license');
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
