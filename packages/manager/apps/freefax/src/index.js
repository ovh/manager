import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import angular from 'angular';
import ngOvhApiWrappers from '@ovh-ux/ng-ovh-api-wrappers';
import ovhManagerFreeFax from '@ovh-ux/manager-freefax';

angular.module('freefaxApp', [ngOvhApiWrappers, ovhManagerFreeFax]);
