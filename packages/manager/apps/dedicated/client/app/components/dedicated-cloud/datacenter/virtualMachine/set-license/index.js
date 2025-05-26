import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-virtualMachine-set-license.component';

const moduleName =
  'ovhManagerDedicatedCloudDataCenterVirtualMachineSetLicenseComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(
    'ovhManagerDedicatedCloudDataCenterVirtualMachineSetLicense',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
