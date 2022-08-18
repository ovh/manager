import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';
import catalog from './catalog';
import orderDashboard from './order-dashboard';
import welcome from './welcome';

import component from './dashboard.component';
import routing from './routing';
import service from './dashboard.service';

import './dashboard.scss';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    catalog,
    orderDashboard,
    ovhManagerHub,
    'ngAtInternet',
    'pascalprecht.translate',
    welcome,
  ])
  .component('hubDashboard', component)
  .config(routing)
  .service('hubDashboardService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
