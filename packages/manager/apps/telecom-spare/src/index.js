import angular from 'angular';

import '@uirouter/angularjs';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
import 'script-loader!intl-tel-input/build/js/intlTelInput.min.js';
import 'script-loader!intl-tel-input/lib/libphonenumber/build/utils.js';
import 'script-loader!international-phone-number/releases/international-phone-number.js';
import 'script-loader!moment/min/moment-with-locales.js';
import 'script-loader!leaflet/dist/leaflet.js';
import 'script-loader!ui-select/dist/select.js';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import '@ovh-ux/manager-telecom-spare';

angular.module('telecomSpareApp', ['ovhManagerTelecomSpare', 'ui.router']);
