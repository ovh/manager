/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';

import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerVeeamEnterprise from '@ovh-ux/manager-veeam-enterprise';

import { momentConfiguration } from './config';

angular
  .module('veeamEnterpriseApp', [ovhManagerCore, ovhManagerVeeamEnterprise])
  .config(momentConfiguration);
