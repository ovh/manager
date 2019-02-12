import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import '@ovh-ux/manager-pack';
// eslint-disable-next-line import/no-webpack-loader-syntax
import 'script-loader!ngSmoothScroll/angular-smooth-scroll';


angular.module('packApp', ['ovhManagerPack']);
