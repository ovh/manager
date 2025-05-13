import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-host-order.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHostOrderComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterHostOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
