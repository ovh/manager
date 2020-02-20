import 'script-loader!jquery'; // eslint-disable-line
import angular from 'angular';
import 'angular-translate';

import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './dashboard.component';

const moduleName = 'ovhManagerHubDashboard';

angular
  .module(moduleName, ['pascalprecht.translate', ovhManagerHub])
  .component('hubDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
