import angular from 'angular';
import 'angular-translate';

import component from './federation-edit.component';
import taskPollProgress from '../../../taskPollProgress';

const moduleName = 'ovhManagerDedicatedCloudUsersActiveDirectoriesEdit';

angular
  .module(moduleName, [taskPollProgress])
  .component('dedicatedCloudUsersActiveDirectoriesEdit', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
