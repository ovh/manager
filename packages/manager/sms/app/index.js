import '@ovh-ux/manager-sms';
import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';

angular.module('smsApp', ['ovhManagerSms']);
