import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-rights.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserRights';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserRights', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
