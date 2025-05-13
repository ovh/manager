import angular from 'angular';
import 'angular-translate';

import taskPollProgress from '../../../taskPollProgress';
import component from './vsphere-user-delete.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserDelete';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudVsphereUserDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
