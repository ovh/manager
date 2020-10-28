import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!jquery-ui/ui/core';
import 'script-loader!jquery-ui/ui/widget';
import 'script-loader!jquery-ui/ui/widgets/mouse';
import 'script-loader!jquery-ui/ui/widgets/draggable';
import 'script-loader!angular-ui-validate/dist/validate.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '@ovh-ux/manager-pci';

angular.module('pciApp', ['ovhManagerPci']);
