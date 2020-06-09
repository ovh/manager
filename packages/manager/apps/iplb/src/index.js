/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import { Environment } from '@ovh-ux/manager-config';

import angular from 'angular';
import ngOvhCloudUniverseComponents from '@ovh-ux/ng-ovh-cloud-universe-components';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerIplb from '@ovh-ux/manager-iplb';

import { momentConfiguration } from './config';

import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.min.css';
import 'ovh-ui-kit-bs/dist/oui-bs3-olt.css';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('iplbApp', [
    ngOvhCloudUniverseComponents,
    ovhManagerCore,
    ovhManagerIplb,
  ])
  .config(
    /* @ngInject */ (CucConfigProvider, coreConfigProvider) => {
      CucConfigProvider.setRegion(coreConfigProvider.getRegion());
    },
  )
  .config(
    /* @ngInject */ ($qProvider) => {
      $qProvider.errorOnUnhandledRejections(false);
    },
  )
  .config(momentConfiguration);
