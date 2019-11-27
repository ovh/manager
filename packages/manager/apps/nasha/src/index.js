/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/manager-nasha';
import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

angular
  .module('nashaApp', [
    'ovhManagerCore',
    'ovhManagerNasha',
  ]);
