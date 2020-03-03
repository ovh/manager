import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';
import orderDashboard from './order-dashboard';
import listingPage from './products-list';

import component from './dashboard.component';
import routing from './routing';
import './dashboard.scss';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    'pascalprecht.translate',
    ovhManagerHub,
    listingPage,
    orderDashboard,
  ])
  .component('hubDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
