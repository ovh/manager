import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-host-orderLegacy.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHostOrderLegacyComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterHostOrderLegacy', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
