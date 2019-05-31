// set environment
import { Environment } from '@ovh-ux/manager-config';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import angular from 'angular';
import ngAnimate from 'angular-animate';
import uiRouter, { RejectType } from '@uirouter/angularjs';
import 'script-loader!lodash';
import 'script-loader!jquery-ui/ui/minified/core.min';
import 'script-loader!jquery-ui/ui/minified/widget.min';
import 'script-loader!jquery-ui/ui/minified/mouse.min';
import 'script-loader!jquery-ui/ui/minified/draggable.min';
import 'script-loader!moment/min/moment-with-locales.min.js';
import 'script-loader!angular-ui-validate/dist/validate.js';
import 'ovh-ui-angular';
import 'script-loader!bootstrap-tour/build/js/bootstrap-tour-standalone.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import get from 'lodash/get';
import has from 'lodash/has';

import navbar from '@ovh-ux/manager-navbar';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerPci from '@ovh-ux/manager-pci';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import ngOvhUserPref from '@ovh-ux/ng-ovh-user-pref';
import ngUirouterBreadcrumb from '@ovh-ux/ng-uirouter-breadcrumb';
import ngUirouterLineProgress from '@ovh-ux/ng-uirouter-line-progress';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

import atInternet from './components/at-internet';
import preload from './components/manager-preload';

import 'bootstrap-tour/build/css/bootstrap-tour.min.css';
import './assets/theme/index.less';
import './index.scss';

import controller from './index.controller';
import service from './index.service';
import routing from './index.routes';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('ovhStack', [
    __NG_APP_INJECTIONS__,
    uiRouter,
    atInternet,
    ngUirouterBreadcrumb,
    ngUirouterLineProgress,
    ovhManagerCore,
    ovhManagerPci,
    ngOvhApiWrappers,
    ngOvhOtrs,
    ngOvhUserPref,
    navbar,
    preload,
    ngAnimate,
    'oui',
  ].filter(value => value !== null)) // Remove null because __NG_APP_INJECTIONS__ can be null
  .controller('PublicCloudController', controller)
  .service('publicCloud', service)
  .config(/* @ngInject */ $locationProvider => $locationProvider.hashPrefix(''))
  .config(routing)
  .config(/* @ngInject */(TranslateServiceProvider) => {
    const defaultLanguage = TranslateServiceProvider.getUserLocale();
    // set moment locale
    moment.locale(defaultLanguage.split('_')[0]);
  })
  .run(/* @ngInject */ ($state) => {
    $state.defaultErrorHandler((error) => {
      if (error.type === RejectType.ERROR) {
        $state.go('pci.error', {
          detail: {
            message: get(error.detail, 'data.message'),
            code: has(error.detail, 'headers') ? error.detail.headers('x-ovh-queryId') : null,
          },
        }, { location: false });
      }
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
