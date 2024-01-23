import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ui-kit';
import ngAtInternet from '@ovh-ux/ng-at-internet';

import component from './dedicatedCloud-vmware-vdc-add.component';
import service from './dedicatedCloud-vmware-vdc-add.service';

const moduleName = 'ovhManagerDedicatedCloudVmwareVdcAddComponent';

angular
  .module(moduleName, [ngAtInternet, 'oui', 'pascalprecht.translate'])
  .component('ovhManagerDedicatedCloudVmwareVdcAdd', component)
  .service('VmwareVdcAddService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
