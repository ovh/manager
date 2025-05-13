import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-edit.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserEdit';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
