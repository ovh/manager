// set environment
import { Environment, findLanguage } from '@ovh-ux/manager-config';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

// lodash imports
import get from 'lodash/get';
// deps
import angular from 'angular';
import 'angular-sanitize';
import 'angular-translate';
import '@uirouter/angularjs';
import { registerCoreModule } from '@ovh-ux/manager-core';

import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth'; // peerDep of manager-core
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ovhManagerCookiePolicy from '@ovh-ux/manager-cookie-policy';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import '@ovh-ux/sign-up';
import signUpFormView from './form';
import detailsState from './details';
import activityState from './activity';
import { registerState } from './routing';

import controller from './index.controller';
import { SANITIZATION } from './constants';
import { TRACKING } from './at-internet.constants';

// styles
import '@ovh-ux/ui-kit/dist/css/oui.css';
import './index.scss';

const environment = new Environment();
environment.setRegion(__WEBPACK_REGION__);

angular
  .module(
    'ovhSignUpApp',
    [
      __NG_APP_INJECTIONS__,
      'ui.router',
      'ngSanitize',
      'pascalprecht.translate',
      registerCoreModule(environment),
      ovhManagerAtInternetConfiguration,
      ovhManagerCookiePolicy,
      ngAtInternet,
      ngAtInternetUiRouterPlugin,
      ngOvhSsoAuth,
      signUpFormView,
      detailsState,
      activityState,
      'ovhSignUp',
    ].filter((value) => value !== null),
  ) // Remove null because __NG_APP_INJECTIONS__ can be null
  .config(
    /* @ngInject */ ($locationProvider, $urlRouterProvider) => {
      $locationProvider.hashPrefix('');
      $urlRouterProvider.otherwise('/');
    },
  )
  .config(
    /* @ngInject */ ($translateProvider) => {
      const getQueryVariable = (variable) => {
        const { hash } = window.location;
        const query = hash.substring(hash.indexOf('?') + 1);
        const vars = query.split('&');
        for (let i = 0; i < vars.length; i += 1) {
          const pair = vars[i].split('=');
          if (decodeURIComponent(pair[0]) === variable) {
            return decodeURIComponent(pair[1]);
          }
        }
        return '';
      };

      const language =
        getQueryVariable('lang') ||
        window.navigator.language ||
        window.navigator.userLanguage ||
        'en';

      const userLocale = findLanguage(language);
      environment.setUserLocale(userLocale);
      $translateProvider.use(userLocale);
    },
  )
  .config(
    /* @ngInject */ (ssoAuthenticationProvider) => {
      ssoAuthenticationProvider.allowIncompleteNic(true);
    },
  )
  .config(
    /* @ngInject */ ($compileProvider) => {
      // SECURITY: authorise only trusted hostname in href and img
      // @see https://docs.angularjs.org/api/ng/provider/$compileProvider#aHrefSanitizationWhitelist
      if (SANITIZATION.regex.test(window.location.href)) {
        $compileProvider.aHrefSanitizationWhitelist(SANITIZATION.regex);
        $compileProvider.imgSrcSanitizationWhitelist(SANITIZATION.regex);
      }
    },
  )
  .config(
    /* @ngInject */ (atInternetConfigurationProvider) => {
      atInternetConfigurationProvider.setConfig(TRACKING);
      atInternetConfigurationProvider.setReplacementRules([
        {
          pattern: /^sign-up/,
          replacement: 'accountcreation',
        },
      ]);
    },
  )
  .config(registerState)
  .run(
    /* @ngInject */ ($transitions) => {
      $transitions.onBefore({}, (transition) => {
        const fromLang = get(transition.params('from'), 'lang');
        const toLang = get(transition.params('to'), 'lang');

        if (fromLang && toLang && fromLang !== toLang) {
          return window.location.reload();
        }

        return true;
      });
    },
  )
  .run(
    /* @ngInject */ ($rootScope, $transitions) =>
      $transitions.onSuccess({}, () =>
        Object.assign($rootScope, { appPreloadHide: 'app-preload-hide' }),
      ),
  )
  .controller('SignUpCtrl', controller);
