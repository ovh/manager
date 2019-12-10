/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import '@ovh-ux/manager-iplb';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('iplbApp', [
    'ovhManagerIplb',
  ])
  .config(/* @ngInject */ (CucConfigProvider, coreConfigProvider) => {
    CucConfigProvider.setRegion(coreConfigProvider.getRegion());
  })
  .config(/* @ngInject */($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  })
  .config(momentConfiguration);
