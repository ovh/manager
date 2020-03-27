import 'script-loader!jquery'; // eslint-disable-line
import '@ovh-ux/manager-metrics';
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';

Environment.setRegion(__WEBPACK_REGION__);

angular.module('metricsApp', ['ovhManagerMetrics']);
