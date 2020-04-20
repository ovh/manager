import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import ovhManagerSms from '@ovh-ux/manager-sms';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';

import angular from 'angular';

angular.module('smsApp', [ngOvhApiWrappers, ovhManagerSms]);
