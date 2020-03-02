import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';
import orderDashboard from './order-dashboard';

import component from './dashboard.component';
import routing from './routing';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, ['pascalprecht.translate', ovhManagerHub, orderDashboard])
  .component('hubDashboard', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
