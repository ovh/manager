import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-zerto-mainPccStep.component';

const moduleName = 'dedicatedCloudDatacenterZertoMainPccModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterZertoMainPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
