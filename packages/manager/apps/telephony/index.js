import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ovhManagerTelephony from '@ovh-ux/manager-telephony';

angular.module('telecomTelephonyApp', [ovhManagerTelephony]);
