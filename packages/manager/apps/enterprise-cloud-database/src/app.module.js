/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!messenger/build/js/messenger.js';
import 'script-loader!messenger/build/js/messenger-theme-future.js';
import 'script-loader!messenger/build/js/messenger-theme-flat.js';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import '@uirouter/angularjs';
import { detach as detachPreloader } from '@ovh-ux/manager-preloader';

import ovhManagerEnterpriseCloudDatabase from '@ovh-ux/manager-enterprise-cloud-database';

import './index.scss';

const moduleName = 'enterpriseCloudDatabaseApp';

angular
  .module(moduleName, ['ui.router', ovhManagerEnterpriseCloudDatabase])
  .config(
    /* @ngInject */ ($urlRouterProvider) =>
      $urlRouterProvider.otherwise('/enterprise-cloud-database'),
  )
  .run(
    /* @ngInject */ ($transitions) => {
      const unregisterHook = $transitions.onSuccess({}, () => {
        detachPreloader();
        unregisterHook();
      });
    },
  );

export default moduleName;
