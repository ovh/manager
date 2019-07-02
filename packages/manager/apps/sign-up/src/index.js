// set environment
import { Environment } from '@ovh-ux/manager-config';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

// deps
import angular from 'angular';
import '@uirouter/angularjs';
import ovhManagerCore from '@ovh-ux/manager-core';
import ngOvhSsoAuth from '@ovh-ux/ng-ovh-sso-auth'; // peerDep of manager-core

import '@ovh-ux/sign-up';
import signUpFormView from './form';
import detailsState from './details';
import activityState from './activity';
import { registerState } from './routing';

// styles
import './assets/theme/index.less';
import 'ovh-ui-kit/dist/oui.css';
import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('ovhSignUpApp', [
    __NG_APP_INJECTIONS__,
    'ui.router',
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
  .config(registerState)
  .run(/* @ngInject */ ($rootScope, $transitions) => $transitions.onSuccess(
    {},
    () => Object.assign($rootScope, { appPreloadHide: 'app-preload-hide' }),
  ));
