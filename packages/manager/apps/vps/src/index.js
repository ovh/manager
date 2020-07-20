/* eslint-disable import/extensions, import/no-webpack-loader-syntax */
import 'babel-polyfill';
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
import 'script-loader!jsurl/lib/jsurl';
import 'script-loader!bootstrap/dist/js/bootstrap';
/* eslint-enable import/extensions, import/no-webpack-loader-syntax */

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import cloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerVps from '@ovh-ux/manager-vps';
import ovhManagerCore from '@ovh-ux/manager-core';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('vpsApp', [cloudUniverseComponents, ovhManagerCore, ovhManagerVps])
  .config(
    /* @ngInject */ (CucConfigProvider, coreConfigProvider) => {
      CucConfigProvider.setRegion(coreConfigProvider.getRegion());
    },
  )
  .config(momentConfiguration)
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  );
