import angular from 'angular';
import 'angular-translate';

import component from './vsphere-users.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUsers';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUsers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
