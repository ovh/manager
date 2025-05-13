import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-host.component';
import service from './dedicatedCloud-datacenter-host.service';

const moduleName = 'ovhManagerDedicatedCloudDatacenterHostComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterHost', component)
  .service('dedicatedCloudDataCenterHostService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
