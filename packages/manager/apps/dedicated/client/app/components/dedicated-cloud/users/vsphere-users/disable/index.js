import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-disable.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserDisable';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserDisable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
