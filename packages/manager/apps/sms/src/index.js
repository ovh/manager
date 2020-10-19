/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';

import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerSms from '@ovh-ux/manager-sms';

angular.module('smsApp', [ngOvhApiWrappers, ovhManagerSms]);
