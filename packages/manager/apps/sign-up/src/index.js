// set environment
import { Environment } from '@ovh-ux/manager-config';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

// lodash imports
import get from 'lodash/get';

// deps
import angular from 'angular';
import 'angular-translate';
import '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth'; // peerDep of manager-core

import '@ovh-ux/sign-up';
import signUpFormView from './form';
import detailsState from './details';
import activityState from './activity';
import { registerState } from './routing';

import controller from './index.controller';

// styles
import './assets/theme/index.less';
import 'ovh-ui-kit/dist/oui.css';
import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('ovhSignUpApp', [
    __NG_APP_INJECTIONS__,
    'ui.router',
    'pascalprecht.translate',
    ovhManagerCore,
    ngOvhSsoAuth,
    signUpFormView,
    detailsState,
    activityState,
    'ovhSignUp',
  ].filter(value => value !== null)) // Remove null because __NG_APP_INJECTIONS__ can be null
  .config(/* @ngInject */ ($locationProvider, $urlRouterProvider) => {
    $locationProvider.hashPrefix('');
    $urlRouterProvider.otherwise('/');
  })
  .config(/* @ngInject */ ($translateProvider, TranslateServiceProvider) => {
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
    const urlLanguage = getQueryVariable('lang') || 'fr';
    const userLocale = TranslateServiceProvider.findLanguage(urlLanguage, urlLanguage);
    TranslateServiceProvider.setUserLocale(userLocale);
    $translateProvider.use(userLocale);
  })
  .config(/* @ngInject */ (ssoAuthenticationProvider) => {
    ssoAuthenticationProvider.allowIncompleteNic(true);
  })
  .config(registerState)
  .run(/* @ngInject */ ($transitions) => {
    $transitions.onBefore({}, (transition) => {
      const fromLang = get(transition.params('from'), 'lang');
      const toLang = get(transition.params('to'), 'lang');

      if (fromLang && toLang && fromLang !== toLang) {
        return window.location.reload();
      }

      return true;
    });
  })
  .run(/* @ngInject */ ($rootScope, $transitions) => $transitions.onSuccess(
    {},
    () => Object.assign($rootScope, { appPreloadHide: 'app-preload-hide' }),
  ))
  .controller('SignUpCtrl', controller);
