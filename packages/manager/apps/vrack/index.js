import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import '@ovh-ux/manager-vrack';

import angular from 'angular';

angular.module('vrackApp', ['ovhManagerVrack']);
