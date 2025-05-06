import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@ovh-ux/ng-translate-async-loader';

import component from './dedicatedCloud-datacenter-virtualMachine-delete-license.component';

const moduleName =
  'ovhManagerDedicatedCloudDataCenterVirtualMachineDeleteLicenseComponent';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
  ])
  .component(
    'ovhManagerDedicatedCloudDataCenterVirtualMachineDeleteLicense',
    component,
  )
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
