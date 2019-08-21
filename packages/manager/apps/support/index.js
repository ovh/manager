import ovhUxManagerSupport from '@ovh-ux/manager-support';
import ovhUxNgOvhOtrs from '@ovh-ux/ng-ovh-otrs';
import uiRouterAngularJs from '@uirouter/angularjs';
import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { registerState } from './index.routing';

angular
  .module('supportApp', [
    ovhUxManagerSupport,
    ovhUxNgOvhOtrs,
    uiRouterAngularJs,
  ])
  .config(registerState)
  .config(/* @ngInject */ OtrsPopupProvider => OtrsPopupProvider
    .setBaseUrlTickets('/support/tickets'));
