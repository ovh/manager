import 'script-loader!jquery'; // eslint-disable-line
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import 'ovh-ui-angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerHub from '@ovh-ux/manager-hub';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';

import atInternet from './components/at-internet';
import preload from './components/manager-preload';

import routing from './routing';
import './index.scss';
import 'ovh-ui-kit/dist/oui.css';

Environment.setRegion(__WEBPACK_REGION__);
Environment.setVersion(__VERSION__);

angular
  .module('managerHubApp', [
    atInternet,
    'oui',
    ovhManagerCore,
    ovhManagerHub,
    ovhManagerNavbar,
    preload,
    uiRouter,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(routing);
