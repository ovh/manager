/* eslint-disable import/no-webpack-loader-syntax, import/extensions */

import 'script-loader!jquery';
import 'script-loader!moment/min/moment.min.js';

import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import '@ovh-ux/ui-kit/dist/css/oui.css';

/* eslint-enable import/no-webpack-loader-syntax, import/extensions */

import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';

import ovhManagerNasha from '@ovh-ux/manager-nasha';
import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);

angular.module('nashaApp', [ovhManagerNasha]);
