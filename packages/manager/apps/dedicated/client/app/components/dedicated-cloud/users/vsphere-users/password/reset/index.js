import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-password-reset.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserPasswordReset';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserPasswordReset', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
