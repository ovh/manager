import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-datastore-orderLegacy.component';

const moduleName =
  'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacyComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(
    'ovhManagerDedicatedCloudDatacenterDatastoreOrderLegacy',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
