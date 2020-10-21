import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!moment/min/moment-with-locales.min'; // eslint-disable-line

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerVeeamCloudConnect from '@ovh-ux/manager-veeam-cloud-connect';
import { Environment } from '@ovh-ux/manager-config';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('veeamCloudConnectApp', [ovhManagerCore, ovhManagerVeeamCloudConnect])
  .config(
    /* @ngInject */ () => {
      const defaultLanguage = Environment.getUserLanguage();
      moment.locale(defaultLanguage);
    },
  );
