import angular from 'angular';
import 'angular-translate';

import component from './vsphere-user-rights-edit.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserRightsEdit';

angular
  .module(moduleName, [])
  .component('dedicatedCloudVsphereUserRightsEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
