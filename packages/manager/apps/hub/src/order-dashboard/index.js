import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './order-dashboard.component';

const moduleName = 'ovhManagerHubOrderDashboard';

angular
  .module(moduleName, ['pascalprecht.translate', ovhManagerHub])
  .component('hubOrderDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
