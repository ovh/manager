/* eslint-disable import/extensions, import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
import 'script-loader!jsurl/lib/jsurl';
import 'script-loader!bootstrap/dist/js/bootstrap';
/* eslint-enable import/extensions, import/no-webpack-loader-syntax */

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import '@ovh-ux/manager-vps';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('vpsApp', [
    'ovhManagerVps',
  ])
  .config(/* @ngInject */ (CucConfigProvider, coreConfigProvider) => {
    CucConfigProvider.setRegion(coreConfigProvider.getRegion());
  })
  .config(momentConfiguration)
  .config(/* @ngInject */($qProvider) => {
    $qProvider.errorOnUnhandledRejections(false);
  });
