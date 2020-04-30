/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!moment/min/moment.min';
/* eslint-enable import/no-webpack-loader-syntax */

import ovhManagerSms from '@ovh-ux/manager-sms';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

import angular from 'angular';

angular.module('smsApp', [ngOvhApiWrappers, ovhManagerSms]);
