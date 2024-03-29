import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-convert-to-global.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterConvertToGlobalComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterConvertToGlobal', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
