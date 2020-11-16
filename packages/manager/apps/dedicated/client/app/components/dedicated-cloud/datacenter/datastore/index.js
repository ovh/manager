import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-datastore.component';
import service from './dedicatedCloud-datacenter-datastore.service';

const moduleName = 'ovhManagerDedicatedCloudDatacenterDatastoreComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterDatastore', component)
  .service('ovhManagerPccDatacenterDatastoreService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
