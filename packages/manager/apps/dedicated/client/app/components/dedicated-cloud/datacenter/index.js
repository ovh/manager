import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-api-services';

import component from './dedicatedCloud-datacenter.component';
import service from './dedicatedCloud-datacenter.service';

const moduleName = 'ovhManagerDedicatedCloudDatacenterComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    'ovh-api-services',
  ])
  .component('ovhManagerDedicatedCloudDatacenter', component)
  .service('ovhManagerPccDatacenterService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
