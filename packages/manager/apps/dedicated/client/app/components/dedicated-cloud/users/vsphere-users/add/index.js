import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-add.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserAdd';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserAdd', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
