import angular from 'angular';
import 'angular-translate';

import taskPollProgress from '../../../taskPollProgress';
import component from './vsphere-user-import.component';

const moduleName = 'ovhManagerDedicatedCloudVsphereUserImport';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudVsphereUserImport', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
