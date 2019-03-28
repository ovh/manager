import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line

import angular from 'angular';
import ovhManagerVrack from '@ovh-ux/manager-vrack';

angular.module('vrackApp', [ovhManagerVrack]);
