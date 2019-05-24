import angular from 'angular';

/* eslint-disable import/no-webpack-loader-syntax, import/extensions */
import 'script-loader!jquery';
import 'script-loader!lodash';
/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import support from '@ovh-ux/manager-support';

angular
  .module('supportApp', [
    support,
    'ui.router',
  ]);
