import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import ovhManagerHub from '@ovh-ux/manager-hub';
import catalog from './catalog';
import listingPage from './products-list';
import orderDashboard from './order-dashboard';
import welcome from './welcome';

import component from './dashboard.component';
import routing from './routing';

import './dashboard.scss';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    catalog,
    listingPage,
    ngAtInternet,
    orderDashboard,
    ovhManagerHub,
    'pascalprecht.translate',
    welcome,
  ])
  .component('hubDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
