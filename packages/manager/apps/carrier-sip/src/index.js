/* eslint-disable import/no-webpack-loader-syntax */
import 'script-loader!jquery';
import 'script-loader!moment/min/moment-with-locales.min';
/* eslint-enable import/no-webpack-loader-syntax */

import angular from 'angular';

// Module dependencies.
import ovhManagerCarrierSip from '@ovh-ux/manager-carrier-sip';
import uiRouter from '@uirouter/angularjs';

import cdr from './cdr';
import endpoints from './endpoints';

// Routing and configuration.
import routing from './routing';
import { momentConfiguration } from './config';

// Styles.
import '@ovh-ux/ui-kit/dist/css/oui.css';

angular
  .module('carrierSipApp', [cdr, endpoints, ovhManagerCarrierSip, uiRouter])
  .config(routing)
  .config(momentConfiguration);
