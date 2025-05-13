import angular from 'angular';
import 'angular-translate';

import taskPollProgress from '../../../taskPollProgress';
import component from './vsphere-user-iam-role.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserIamRole';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudVsphereUserIamRole', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
