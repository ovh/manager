import managerSupport from '@ovh-ux/manager-support';
import uiRouterAngularJs from '@uirouter/angularjs';
import angular from 'angular';
import navbar from '@ovh-ux/manager-navbar';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import { state } from './index.routing';

angular
  .module('supportApp', [managerSupport, navbar, uiRouterAngularJs])
  .config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  );
