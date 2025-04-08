import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-virtualMachine.component';

const moduleName = 'ovhManagerDedicatedCloudDatacenterVirtualMachineComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterVirtualMachine', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
