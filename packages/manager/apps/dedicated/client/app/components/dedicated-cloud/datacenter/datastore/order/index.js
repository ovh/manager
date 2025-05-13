import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-datastore-order.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDatastoreOrderComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterDatastoreOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
