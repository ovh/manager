import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment/min/moment.min.js'; // eslint-disable-line

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerOtb from '@ovh-ux/manager-overthebox';

import 'ovh-manager-webfont/dist/css/ovh-font.css';

angular.module('overtheboxApp', [ngOvhApiWrappers, ovhManagerOtb]);
