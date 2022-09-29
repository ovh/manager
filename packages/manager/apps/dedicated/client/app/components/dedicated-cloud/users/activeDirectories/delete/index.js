import angular from 'angular';
import 'angular-translate';

import component from './federation-delete.component';
import taskPollProgress from '../../../taskPollProgress';

const moduleName = 'ovhManagerDedicatedCloudUsersActiveDirectoriesDelete';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudUsersActiveDirectoriesDelete', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
