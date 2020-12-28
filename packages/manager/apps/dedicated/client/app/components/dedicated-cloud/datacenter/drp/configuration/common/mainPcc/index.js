import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-drp-mainPccStep.component';

const moduleName = 'dedicatedCloudDatacenterDrpMainPccModule';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterDrpMainPcc', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
