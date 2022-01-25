import angular from 'angular';

import '@ovh-ux/ui-kit';
import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './dashboard.component';

const moduleName = 'ovhManagerBmServerBandwidthDashboardComponent';

angular
  .module(moduleName, [
    'oui',
    'pascalprecht.translate',
    'ngTranslateAsyncLoader',
    ovhManagerCore,
  ])
  .component('serverBandwidthDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
