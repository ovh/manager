import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-veeam-cloud-connect';
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import 'script-loader!moment/min/moment-with-locales.min'; // eslint-disable-line

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('veeamCloudConnectApp', [
    'ovhManagerVeeamCloudConnect',
  ])
  .config(/* @ngInject */ (TranslateServiceProvider) => {
    const defaultLanguage = TranslateServiceProvider.getUserLocale(true);
    moment.locale(defaultLanguage);
  });
