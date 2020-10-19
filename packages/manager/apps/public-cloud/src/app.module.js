// set environment
import { Environment } from '@ovh-ux/manager-config';

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
import 'script-loader!bootstrap-tour/build/js/bootstrap-tour-standalone.min';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import get from 'lodash/get';
import has from 'lodash/has';

import navbar from '@ovh-ux/manager-navbar';
import ovhManagerAccountSidebar from '@ovh-ux/manager-account-sidebar';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerMfaEnrollment from '@ovh-ux/mfa-enrollment';
import ovhManagerPci from '@ovh-ux/manager-pci';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngUiRouterBreadcrumb from '@ovh-ux/ng-ui-router-breadcrumb';
import ngUiRouterLineProgress from '@ovh-ux/ng-ui-router-line-progress';
import ngOvhSsoAuthModalPlugin from '@ovh-ux/ng-ovh-sso-auth-modal-plugin';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';
import ovhNotificationsSidebar from '@ovh-ux/manager-notifications-sidebar';

import '@ovh-ux/ui-kit/dist/css/oui.css';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

import atInternet from './components/at-internet';
import darkMode from './components/dark-mode';

import './assets/theme/default/index.less';
import './index.scss';

import controller from './index.controller';
import service from './index.service';
import routing from './index.routes';

Environment.setVersion(__VERSION__);

const moduleName = 'ovhPublicCloudApp';
angular
  .module(
    moduleName,
    [
      ...get(__NG_APP_INJECTIONS__, Environment.getRegion(), []),
      atInternet,
      darkMode,
      ngAnimate,
      ngUiRouterBreadcrumb,
      ngUiRouterLineProgress,
      ngOvhApiWrappers,
      ngOvhSsoAuthModalPlugin,
      ngOvhUserPref,
      navbar,
      'oui',
      ovhManagerAccountSidebar,
      ovhManagerCore,
      ovhManagerMfaEnrollment,
      ovhManagerPci,
      ovhNotificationsSidebar,
      uiRouter,
    ].filter((value) => value !== null),
  ) // Remove null because __NG_APP_INJECTIONS__ can be null
  .controller('PublicCloudController', controller)
  .service('publicCloud', service)
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
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
  .config(
    /* @ngInject */ (ouiCalendarConfigurationProvider) => {
      const lang = Environment.getUserLanguage();
      return import(`flatpickr/dist/l10n/${lang}.js`)
        .then((module) => {
          ouiCalendarConfigurationProvider.setLocale(module.default[lang]);
        })
        .catch(() => {});
    },
  )
  .run(
    /* @ngInject */ ($rootScope, $state) => {
      $state.defaultErrorHandler((error) => {
        if (error.type === RejectType.ERROR) {
          $rootScope.$emit('ovh::sidebar::hide');
          $state.go(
            'pci.error',
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
        unregisterHook();
      });
    },
  );

export default moduleName;
