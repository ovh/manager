import angular from 'angular';
import 'angular-translate';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import ovhManagerBanner from '@ovh-ux/manager-banner';
import ovhManagerHub from '@ovh-ux/manager-hub';
import listingPage from './products-list';
import orderDashboard from './order-dashboard';
import welcome from './welcome';

import component from './dashboard.component';
import routing from './routing';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, [
    listingPage,
    ngAtInternet,
    orderDashboard,
    ovhManagerBanner,
    ovhManagerHub,
    'pascalprecht.translate',
    welcome,
  ])
  .component('hubDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
