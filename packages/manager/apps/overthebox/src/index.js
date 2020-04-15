import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerOtb from '@ovh-ux/manager-overthebox';

angular.module('overtheboxApp', [ngOvhApiWrappers, ovhManagerOtb]);
