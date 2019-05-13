import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import '@ovh-ux/manager-support';

angular.module('supportApp', ['ovhManagerSupport']);
