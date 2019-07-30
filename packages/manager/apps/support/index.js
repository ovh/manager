import support from '@ovh-ux/manager-support';
import ngOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import uiRouter from '@uirouter/angularjs';
import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import {
  APP_STATE,
  APP_ACCOUNT_STATE,
} from './index.routing';

angular
  .module('supportApp', [
    ngOvhOtrs,
    support,
    uiRouter,
  ])
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(APP_STATE.name, APP_STATE);
  })
  .config(/* @ngInject */ ($stateProvider) => {
    $stateProvider.state(APP_ACCOUNT_STATE.name, APP_ACCOUNT_STATE);
  })
  .config(/* @ngInject */ OtrsPopupProvider => OtrsPopupProvider
    .setBaseUrlTickets('/support/ticket'));
