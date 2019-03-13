import 'script-loader!jquery'; // eslint-disable-line
import 'script-loader!jquery.scrollto'; // eslint-disable-line
import 'script-loader!lodash'; // eslint-disable-line
import 'script-loader!moment'; // eslint-disable-line

import angular from 'angular';
import ngAria from 'angular-aria';
import ngMessages from 'angular-messages';
import ngSanitize from 'angular-sanitize';
import 'angular-resource';
import translate from 'angular-translate';

import core from '@ovh-ux/manager-core';
import overthebox from '@ovh-ux/manager-overthebox';
import freefax from '@ovh-ux/manager-freefax';
import sms from '@ovh-ux/manager-sms';
import welcome from '@ovh-ux/manager-welcome';

import routing from './manager-layout-ovh.routes';
import sidebar from './sidebar';
import navbar from './navbar';

import '@ovh-ux/ng-ovh-api-wrappers';
import 'angular-ui-bootstrap';
import 'at-internet-ui-router-plugin';
import 'ng-at-internet';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';

import './manager-layout-ovh.scss';
import './manager-layout-ovh.less';

angular
  .module('ovhManager', [
    'atInternetUiRouterPlugin',
    core,
    freefax,
    navbar,
    'ng-at-internet',
    ngAria,
    ngMessages,
    ngSanitize,
    'oui',
    overthebox,
    sidebar,
    sms,
    translate,
    'ui.bootstrap',
    welcome,
  ])
  .config($locationProvider => $locationProvider.hashPrefix(''))
  .config(routing);
