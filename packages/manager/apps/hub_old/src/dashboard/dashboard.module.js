import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';
import orderDashboard from './order-dashboard';
import welcome from './welcome';

import component from './dashboard.component';
import routing from './routing';

import './dashboard.scss';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    orderDashboard,
    ovhManagerHub,
    'ngAtInternet',
    'pascalprecht.translate',
    welcome,
  ])
  .component('hubDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
