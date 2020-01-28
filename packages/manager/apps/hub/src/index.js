import 'script-loader!jquery'; // eslint-disable-line
import { Environment } from '@ovh-ux/manager-config';
import angular from 'angular';
import uiRouter from '@uirouter/angularjs';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import oui from '@ovh-ux/ui-kit';
import ovhManagerCore from '@ovh-ux/manager-core';
import ovhManagerNavbar from '@ovh-ux/manager-navbar';

import atInternet from './components/at-internet';
import preload from './components/manager-preload';

import routing from './routing';
import './index.scss';

Environment.setRegion(__WEBPACK_REGION__);
Environment.setVersion(__VERSION__);

angular
  .module('managerHubApp', [
    atInternet,
    oui,
    ovhManagerCore,
    ovhManagerNavbar,
    preload,
    uiRouter,
  ])
  .config(
    /* @ngInject */ ($locationProvider) => $locationProvider.hashPrefix(''),
  )
  .config(routing);
