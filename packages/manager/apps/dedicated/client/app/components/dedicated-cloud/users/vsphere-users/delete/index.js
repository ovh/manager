import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-delete.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserDelete';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
