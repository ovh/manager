import managerSupport from '@ovh-ux/manager-support';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import uiRouterAngularJs from '@uirouter/angularjs';
import angular from 'angular';
import navbar from '@ovh-ux/manager-navbar';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { state } from './index.routing';

angular
  .module('supportApp', [
    managerSupport,
    navbar,
    ngOvhOtrs,
    uiRouterAngularJs,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(state.name, state);
  })
  .config(/* @ngInject */ OtrsPopupProvider => OtrsPopupProvider
    .setBaseUrlTickets('/support/tickets'));
