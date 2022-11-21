import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-enable.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserEnable';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserEnable', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
