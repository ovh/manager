import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-virtualMachine.component';
import service from './dedicatedCloud-datacenter-virtualMachine.service';

const moduleName = 'ovhManagerDedicatedCloudDatacenterVirtualMachineComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component('ovhManagerDedicatedCloudDatacenterVirtualMachine', component)
  .service('ovhManagerDedicatedCloudDatacenterVirtualMachineService', service)

  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
