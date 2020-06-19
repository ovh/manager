import managerSupport from '@ovh-ux/manager-support';
import uiRouterAngularJs from '@uirouter/angularjs';
import angular from 'angular';
import { registerApplication } from '@ovh-ux/manager-ufrontend';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { state } from './index.routing';

registerApplication('support', ({ api }) => {
  angular.module('supportApp', [managerSupport, uiRouterAngularJs]).config(
    /* @ngInject */ ($stateProvider) => {
      $stateProvider.state(state.name, state);
    },
  );

  api.installAngularJSApplication({
    angular,
    modules: ['supportApp'],
    template: '<div data-ui-view></div>',
  });
});
